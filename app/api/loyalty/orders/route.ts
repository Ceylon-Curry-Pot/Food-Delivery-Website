import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';

const STALE_TERMINAL_STATUSES = ['delivered', 'cancelled'];
const STALE_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * GET /api/loyalty/orders
 *
 * Every order placed while signed in gets `loyaltyMember` stamped onto it at
 * creation (see /api/orders and /api/payhere/hash). This lists them for the
 * "Your Orders" panel on the tracker page — most recent first, guests get an
 * empty list rather than an error so the client doesn't need special-casing.
 *
 * Delivered/cancelled orders drop off the list a week after they settled —
 * `updatedAt` is the best available marker for "when it reached that state",
 * since a terminal status is always the last write to the order. Anything
 * still active stays visible regardless of age.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.accountType !== 'loyalty') {
      return NextResponse.json({ orders: [] });
    }

    await connectToDatabase();

    const staleCutoff = new Date(Date.now() - STALE_AFTER_MS);

    const orders = await Order.find({
      loyaltyMember: session.user.id,
      $or: [
        { status: { $nin: STALE_TERMINAL_STATUSES } },
        { updatedAt: { $gte: staleCutoff } },
      ],
    })
      .sort({ createdAt: -1 })
      .select('orderNumber status type total items paymentMethod createdAt')
      .lean();

    return NextResponse.json({
      orders: orders.map((order) => ({
        _id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status,
        type: order.type,
        total: order.total,
        itemCount: order.items.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0),
        paymentMethod: order.paymentMethod,
        createdAt: (order.createdAt as Date).toISOString(),
      })),
    });
  } catch (error) {
    console.error('[GET /api/loyalty/orders]', error);
    return NextResponse.json({ orders: [] });
  }
}
