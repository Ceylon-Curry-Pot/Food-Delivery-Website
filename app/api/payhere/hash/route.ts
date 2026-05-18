import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import {
  buildOrderItems,
  calculateOrderTotal,
  OrderInputError,
  serializeOrder,
} from '@/lib/orderData';
import {
  buildCheckoutHash,
  formatPayhereAmount,
  getPayhereConfig,
  getPublicBaseUrl,
  PAYHERE_CURRENCY,
  splitCustomerName,
} from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, type, deliveryAddress, items, note } = body;

    if (!customer?.name || !customer?.phone || !type || !items?.length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (type !== 'delivery' && type !== 'pickup') {
      return NextResponse.json({ message: 'Invalid order type' }, { status: 400 });
    }

    const { merchantId, merchantSecret, sandbox } = getPayhereConfig();
    const baseUrl = getPublicBaseUrl(req);

    await connectToDatabase();

    const orderItems = await buildOrderItems(items, true);
    const total = calculateOrderTotal(orderItems, type);
    const amount = formatPayhereAmount(total);
    const timestamp = Date.now().toString().slice(-6);
    const orderNumber = `CEY${timestamp}`;
    const { firstName, lastName } = splitCustomerName(customer.name);

    const order = await Order.create({
      orderNumber,
      customer,
      type,
      deliveryAddress: type === 'delivery' ? deliveryAddress : undefined,
      items: orderItems,
      total,
      note,
      paymentMethod: 'payhere',
      paymentStatus: 'pending',
      payhereStatusCode: '0',
      status: 'pending',
    });

    const itemSummary = orderItems
      .map((item) => `${item.name} x ${item.qty}`)
      .join(', ')
      .slice(0, 255);

    const payment = {
      sandbox,
      merchant_id: merchantId,
      return_url: `${baseUrl}/tracker/${order._id.toString()}`,
      cancel_url: `${baseUrl}/checkout`,
      notify_url: `${baseUrl}/api/payhere/notify`,
      order_id: orderNumber,
      items: itemSummary || `Order ${orderNumber}`,
      amount,
      currency: PAYHERE_CURRENCY,
      hash: buildCheckoutHash(
        merchantId,
        orderNumber,
        amount,
        PAYHERE_CURRENCY,
        merchantSecret
      ),
      first_name: firstName,
      last_name: lastName,
      email: customer.email || 'customer@example.com',
      phone: customer.phone,
      address: deliveryAddress || 'Pickup at Ceylon Curry Pot',
      city: type === 'delivery' ? 'Colombo' : 'Colombo',
      country: 'Sri Lanka',
      custom_1: order._id.toString(),
      custom_2: orderNumber,
    };

    const populated = await Order.findById(order._id).populate('items.menuItem').lean();

    return NextResponse.json({
      order: serializeOrder(populated),
      payment,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderInputError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error('[POST /api/payhere/hash]', error);
    return NextResponse.json({ message: 'Failed to create PayHere checkout' }, { status: 500 });
  }
}
