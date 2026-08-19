import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendOrderConfirmation } from '@/lib/sendOrderConfirmation';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import {
  buildOrderItems,
  calculateOrderTotal,
  OrderInputError,
  serializeOrder,
} from '@/lib/orderData';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await connectToDatabase();

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: regex },
        { 'customer.name': regex },
        { 'customer.phone': regex },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('items.menuItem')
      .lean();

    return NextResponse.json(orders.map(serializeOrder));
  } catch (error) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, type, deliveryAddress, items, note, paymentMethod } = body;

    if (!customer?.name || !customer?.phone || !type || !items?.length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (type !== 'delivery' && type !== 'pickup') {
      return NextResponse.json({ message: 'Invalid order type' }, { status: 400 });
    }

    // Attach the loyalty member from the session, never from the request body —
    // this is what later entitles the order to earn points.
    const session = await getServerSession(authOptions);
    const loyaltyMember =
      session?.user?.accountType === 'loyalty' ? session.user.id : undefined;

    await connectToDatabase();
    const orderItems = await buildOrderItems(items, true);
    const orderTotal = calculateOrderTotal(orderItems, type);

    const timestamp   = Date.now().toString().slice(-6);
    const orderNumber = `CEY${timestamp}`;

    const order = await Order.create({
      orderNumber,
      customer,
      type,
      deliveryAddress: type === 'delivery' ? deliveryAddress : undefined,
      items: orderItems,
      total: orderTotal,
      note,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending',
      status: 'pending',
      loyaltyMember,
    });

    const populated = await Order.findById(order._id).populate('items.menuItem').lean();
    const serialized = serializeOrder(populated);

    // Send confirmation email — wrapped in try/catch so a Resend failure
    // never blocks or breaks the order response
    if (serialized.customer?.email) {
  try {
    type SerializedItem = { name: string; qty: number; price: number };

    await sendOrderConfirmation({
      customerName:    serialized.customer.name,
      customerEmail:   serialized.customer.email,
      trackingId:      serialized.orderNumber,
      orderId:         serialized._id,
      total:           serialized.total,
      orderType:       serialized.type,
      deliveryAddress: serialized.deliveryAddress,
      paymentMethod:   serialized.paymentMethod,
      items:           (serialized.items as SerializedItem[]).map((i) => ({
        name:  i.name,
        qty:   i.qty,
        price: i.price,
      })),
    });
  } catch (emailError) {
    console.error('[Email] Failed to send order confirmation:', emailError);
  }
}

    return NextResponse.json(serialized, { status: 201 });
  } catch (error) {
    if (error instanceof OrderInputError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error('[POST /api/orders]', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}