import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Order, { generateOrderNumber } from '@/lib/models/Order';
import {
  buildOrderItems,
  calculateOrderTotals,            // was calculateOrderTotal
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
    const { customer, type, deliveryAddress, deliveryArea, items, note } = body; // deliveryArea added

    if (!customer?.name || !customer?.phone || !type || !items?.length) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    if (type !== 'delivery' && type !== 'pickup') {
      return NextResponse.json({ message: 'Invalid order type' }, { status: 400 });
    }

    const { merchantId, merchantSecret, sandbox } = getPayhereConfig();
    const baseUrl = getPublicBaseUrl(req);

    // Stamped from the session so the PayHere webhook — which has no session of
    // its own — knows who to credit once payment is confirmed.
    const session = await getServerSession(authOptions);
    const loyaltyMember =
      session?.user?.accountType === 'loyalty' ? session.user.id : undefined;

    await connectToDatabase();

    const orderItems = await buildOrderItems(items, true);
    const totals = calculateOrderTotals(orderItems, type, deliveryArea); // `totals`, not `total`
    const amount = formatPayhereAmount(totals.total);
    const orderNumber = await generateOrderNumber();
    const { firstName, lastName } = splitCustomerName(customer.name);

    const order = await Order.create({
      orderNumber,
      customer,
      type,
      deliveryAddress: type === 'delivery' ? deliveryAddress : undefined,
      items: orderItems,
      total: totals.total,
      deliveryArea: totals.deliveryArea,
      deliveryFee: totals.deliveryFee,
      note,
      paymentMethod: 'payhere',
      paymentStatus: 'pending',
      payhereStatusCode: '0',
      status: 'pending',
      loyaltyMember,
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
      city: totals.deliveryArea ?? 'Colombo',
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