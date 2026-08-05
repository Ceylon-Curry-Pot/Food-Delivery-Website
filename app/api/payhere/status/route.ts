import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { serializeOrder } from '@/lib/orderData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const orderNumber = searchParams.get('orderNumber');

    if (!orderId && !orderNumber) {
      return NextResponse.json({ message: 'Missing order id' }, { status: 400 });
    }

    await connectToDatabase();

    const order = orderId && mongoose.Types.ObjectId.isValid(orderId)
      ? await Order.findById(orderId).populate('items.menuItem').lean()
      : await Order.findOne({ orderNumber }).populate('items.menuItem').lean();

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    console.error('[GET /api/payhere/status]', error);
    return NextResponse.json({ message: 'Failed to fetch payment status' }, { status: 500 });
  }
}
