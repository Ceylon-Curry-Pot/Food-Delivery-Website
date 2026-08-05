import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import {
  formatPayhereAmount,
  mapPayhereStatus,
  type PayhereNotifyPayload,
  verifyPayhereNotification,
} from '@/lib/payhere';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

    const notification: PayhereNotifyPayload = {
      merchant_id: payload.merchant_id,
      order_id: payload.order_id,
      payment_id: payload.payment_id,
      payhere_amount: payload.payhere_amount,
      payhere_currency: payload.payhere_currency,
      status_code: payload.status_code,
      md5sig: payload.md5sig,
      method: payload.method,
    };

    if (!hasRequiredNotificationFields(notification)) {
      return NextResponse.json({ message: 'Invalid PayHere notification' }, { status: 400 });
    }

    if (!verifyPayhereNotification(notification)) {
      console.error('[POST /api/payhere/notify] Invalid md5sig', {
        orderId: notification.order_id,
        paymentId: notification.payment_id,
      });
      return NextResponse.json({ message: 'Invalid PayHere signature' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOne({ orderNumber: notification.order_id });
    if (!order) {
      console.error('[POST /api/payhere/notify] Order not found', notification.order_id);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const expectedAmount = formatPayhereAmount(order.total);
    if (
      notification.payhere_amount !== expectedAmount ||
      notification.payhere_currency !== 'LKR'
    ) {
      console.error('[POST /api/payhere/notify] Amount or currency mismatch', {
        orderNumber: order.orderNumber,
        expectedAmount,
        receivedAmount: notification.payhere_amount,
        receivedCurrency: notification.payhere_currency,
      });
      return NextResponse.json({ message: 'Amount mismatch' }, { status: 400 });
    }

    const paymentStatus = mapPayhereStatus(notification.status_code);
    const updateData: Record<string, unknown> = {
      paymentStatus,
      payherePaymentId: notification.payment_id,
      payhereStatusCode: notification.status_code,
      payhereMd5sig: notification.md5sig,
      paymentMethod: notification.method || 'payhere',
    };

    if (paymentStatus === 'paid') {
      updateData.status = 'confirmed';
      updateData.paidAt = order.paidAt || new Date();
    } else if (paymentStatus === 'cancelled' || paymentStatus === 'failed') {
      updateData.status = 'cancelled';
    }

    await Order.updateOne({ _id: order._id }, { $set: updateData });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[POST /api/payhere/notify]', error);
    return NextResponse.json({ message: 'Failed to process PayHere notification' }, { status: 500 });
  }
}

function hasRequiredNotificationFields(payload: PayhereNotifyPayload) {
  return Boolean(
    payload.merchant_id &&
      payload.order_id &&
      payload.payhere_amount &&
      payload.payhere_currency &&
      payload.status_code &&
      payload.md5sig
  );
}
