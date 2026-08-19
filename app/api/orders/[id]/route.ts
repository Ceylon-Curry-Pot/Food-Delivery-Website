import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import mongoose from 'mongoose';
import {
  buildOrderItems,
  calculateOrderTotal,
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

    if ('type' in updateData && updateData.type !== 'delivery' && updateData.type !== 'pickup') {
      return NextResponse.json({ message: 'Invalid order type' }, { status: 400 });
    }

    if (Object.keys(updateData).length === 0 && !('items' in body)) {
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

    if ('items' in body || 'type' in updateData) {
      updateData.total = calculateOrderTotal(orderItems, type);
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
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
