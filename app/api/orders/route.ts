import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';

// GET /api/orders — list all orders with optional ?status= and ?search= filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await connectToDatabase();

    const query: Record<string, unknown> = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.name': regex },
        { 'customer.phone': regex },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('items.menuItem').lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders — manually create a new order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, type, deliveryAddress, items, total, status } = body;

    if (!customer?.name || !customer?.phone || !type || !items?.length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // Generate unique order number: CEY + 6-digit number
    const timestamp = Date.now().toString().slice(-6);
    const orderNumber = `CEY${timestamp}`;

    const order = await Order.create({
      orderNumber,
      customer,
      type,
      deliveryAddress: type === 'delivery' ? deliveryAddress : undefined,
      items,
      total,
      status: status || 'pending',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('[POST /api/orders]', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
