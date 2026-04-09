import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';

// GET /api/orders/:id — full order detail
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const order = await Order.findById(params.id).populate('items.menuItem').lean();
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('[GET /api/orders/:id]', error);
    return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH /api/orders/:id — update any order field(s)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Whitelist of updatable fields
    const allowedFields = ['status', 'type', 'deliveryAddress', 'customer', 'items', 'total'];
    const updateData: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'No valid fields to update' }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await Order.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/orders/:id]', error);
    return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
  }
}
