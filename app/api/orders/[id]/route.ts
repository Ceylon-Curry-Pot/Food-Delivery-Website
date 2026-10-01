import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import mongoose from 'mongoose';
import {
  buildOrderItems,
  calculateOrderTotals,          // was calculateOrderTotal
  LEGACY_DELIVERY_FEE,           // new
  OrderInputError,
  serializeOrder,
} from '@/lib/orderData';
import { revertLoyaltyPointsForOrder } from '@/lib/awardLoyaltyPoints';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    // Support both MongoDB _id and human-readable orderNumber (e.g. CEY123456)
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const order = isObjectId
      ? await Order.findById(id).populate('items.menuItem').lean()
      : await Order.findOne({ orderNumber: id }).populate('items.menuItem').lean();

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    console.error('[GET /api/orders/:id]', error);
    return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // NOTE: deliveryArea is deliberately NOT in this list. Its stored value comes
    // from calculateOrderTotals (the canonical spelling), never straight from the body.
    const allowedFields = [
      'status',
      'type',
      'deliveryAddress',
      'customer',
      'note',
      'paymentMethod',
      'paymentStatus',
    ];
    const updateData: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (key in body) updateData[key] = body[key];
    }

    // A blank or missing area means "not provided", not "set it to empty".
    const requestedArea: string | undefined =
      typeof body.deliveryArea === 'string' && body.deliveryArea.trim()
        ? body.deliveryArea.trim()
        : undefined;

    if ('type' in updateData && updateData.type !== 'delivery' && updateData.type !== 'pickup') {
      return NextResponse.json({ message: 'Invalid order type' }, { status: 400 });
    }

    if (
      Object.keys(updateData).length === 0 &&
      !('items' in body) &&
      requestedArea === undefined
    ) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Order.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const type = (updateData.type ?? existing.type) as 'delivery' | 'pickup';
    const orderItems = 'items' in body
      ? await buildOrderItems(body.items, false)
      : existing.items;

    if ('items' in body) {
      updateData.items = orderItems;
    }

    // Fields to remove from the document (used when an order becomes pickup).
    const unsetData: Record<string, ''> = {};

    // Reprice only when something that affects the price was touched.
    if ('items' in body || 'type' in updateData || requestedArea !== undefined) {
      const area = requestedArea ?? existing.deliveryArea;

      // Keep the fee this order was originally priced at ONLY when it was already a
      // delivery order and its area isn't changing. A pickup order switching to delivery
      // must pick an area and get today's price (its stored fee of 0 means "pickup").
      const wasDelivery = existing.type === 'delivery';
      const areaUnchanged = area === existing.deliveryArea;

      let lockedFee: number | undefined;
      if (type === 'delivery' && wasDelivery && areaUnchanged) {
        lockedFee =
          existing.deliveryFee ??
          // Old order from before zones existed: no saved fee and no area → it was Rs 300.
          (existing.deliveryArea ? undefined : LEGACY_DELIVERY_FEE);
      }

      // Throws OrderInputError (→ 400) if a delivery order has no valid area to price.
      const totals = calculateOrderTotals(orderItems, type, area, lockedFee);

      updateData.total = totals.total;
      updateData.deliveryFee = totals.deliveryFee;

      if (totals.deliveryArea) {
        updateData.deliveryArea = totals.deliveryArea;
      } else {
        unsetData.deliveryArea = ''; // pickup: don't keep a stale area
      }
    }

    const update: Record<string, unknown> = { $set: updateData };
    if (Object.keys(unsetData).length > 0) update.$unset = unsetData;

    const updated = await Order.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).populate('items.menuItem').lean();

    if (!updated) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Reverting is scoped to an actual transition into 'cancelled' — a PATCH
    // that merely re-saves an already-cancelled order shouldn't re-trigger it.
    // Never let a loyalty failure turn an otherwise-successful cancellation
    // into an error response.
    if (updateData.status === 'cancelled' && existing.status !== 'cancelled') {
      try {
        await revertLoyaltyPointsForOrder(id);
      } catch (loyaltyError) {
        console.error('[loyalty] Failed to revert points for cancelled order', id, loyaltyError);
      }
    }

    return NextResponse.json(serializeOrder(updated));
  } catch (error) {
    if (error instanceof OrderInputError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('[PATCH /api/orders/:id]', error);
    return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
  }
}