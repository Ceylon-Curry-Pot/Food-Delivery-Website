'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, MapPin, Phone, CreditCard, Clock } from 'lucide-react';
import OrderStatusTracker from '@/components/tracker/OrderStatusTracker';
import type { OrderStatus } from '@/lib/models/Order';

type OrderItem = {
  name: string;
  qty: number;
  price: number;
  image?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string };
  type: 'delivery' | 'pickup';
  deliveryAddress?: string;
  items: OrderItem[];
  total: number;
  note?: string;
  paymentMethod?: string;
  createdAt: string;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:          'Order Received',
  confirmed:        'Order Confirmed',
  preparing:        'Being Prepared',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:          'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed:        'bg-blue-50 text-blue-700 border-blue-200',
  preparing:        'bg-orange-50 text-orange-700 border-orange-200',
  out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered:        'bg-green-50 text-green-700 border-green-200',
  cancelled:        'bg-red-50 text-red-700 border-red-200',
};

export default function TrackOrderPage() {
  const { id }                          = useParams<{ id: string }>();
  const [order, setOrder]               = useState<Order | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [refreshing, setRefreshing]     = useState(false);
  const [lastUpdated, setLastUpdated]   = useState<Date>(new Date());

  const fetchOrder = async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${id}`, { cache: 'no-store' });
      if (!res.ok) { setError('Order not found.'); return; }
      const data = await res.json();
      setOrder(data);
      setLastUpdated(new Date());
    } catch {
      setError('Failed to load order. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => { fetchOrder(); }, [id]);

  // Poll every 30 seconds while order is not terminal
  useEffect(() => {
    if (!order) return;
    if (order.status === 'delivered' || order.status === 'cancelled') return;
    const interval = setInterval(() => fetchOrder(true), 30_000);
    return () => clearInterval(interval);
  }, [order?.status]);

  /* ── Loading ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your order…</p>
        </div>
      </main>
    );
  }

  /* ── Error ── */
  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-sm text-gray-400 mb-6">{error || 'We couldn't find this order.'}</p>
          <Link href="/tracker" className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 transition-colors">
            Try Again
          </Link>
        </div>
      </main>
    );
  }

  const placedAt = new Date(order.createdAt);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Back + refresh ── */}
        <div className="flex items-center justify-between">
          <Link
            href="/tracker"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-red-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Track another order
          </Link>
          <button
            onClick={() => fetchOrder(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Order Number</p>
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{order.orderNumber}</h1>
            </div>
            <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Placed at {placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
            {placedAt.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>

        {/* ── Tracker ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-6">Order Progress</h2>
          <OrderStatusTracker status={order.status} />
        </div>

        {/* ── Order items ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                </div>
                <p className="text-sm font-bold text-gray-700 flex-shrink-0">
                  Rs. {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-base">
            <span className="text-gray-900">Total</span>
            <span className="text-red-600">Rs. {order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* ── Delivery + customer info ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">{order.customer.name}</p>
                <p className="text-gray-400">{order.customer.phone}</p>
              </div>
            </div>

            {order.type === 'delivery' && order.deliveryAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Delivery Address</p>
                  <p className="text-gray-400">{order.deliveryAddress}</p>
                </div>
              </div>
            )}

            {order.type === 'pickup' && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Pickup Location</p>
                  <p className="text-gray-400">123 Galle Road, Colombo 03</p>
                </div>
              </div>
            )}

            {order.paymentMethod && (
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800">Payment</p>
                  <p className="text-gray-400 capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>
            )}

            {order.note && (
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Note</p>
                <p className="text-gray-700 text-sm">{order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Help ── */}
        <div className="text-center pb-4">
          <p className="text-xs text-gray-400">
            Need help?{' '}
            <Link href="/contact" className="text-red-600 font-medium hover:underline">
              Contact us
            </Link>
            {' '}or call{' '}
            <a href="tel:+94112345678" className="text-red-600 font-medium hover:underline">
              +94 11 234 5678
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}