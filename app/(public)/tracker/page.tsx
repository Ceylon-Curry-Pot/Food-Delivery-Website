'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ChevronRight, Clock } from 'lucide-react';
import { useLoyaltyStore } from '@/components/loyalty/useLoyaltyStore';
import { fetchMyOrders, type LoyaltyOrderSummary, type LoyaltyOrderStatus } from '@/lib/loyaltyApi';

const STATUS_LABELS: Record<LoyaltyOrderStatus, string> = {
  pending:          'Order Received',
  confirmed:        'Confirmed',
  preparing:        'Being Prepared',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

const STATUS_COLORS: Record<LoyaltyOrderStatus, string> = {
  pending:          'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed:        'bg-blue-50 text-blue-700 border-blue-200',
  preparing:        'bg-orange-50 text-orange-700 border-orange-200',
  out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered:        'bg-green-50 text-green-700 border-green-200',
  cancelled:        'bg-red-50 text-red-700 border-red-200',
};

function MyOrdersPanel() {
  const [orders, setOrders]   = useState<LoyaltyOrderSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyOrders().then((data) => {
      if (!cancelled) setOrders(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (orders === null) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-center">
        <p className="text-sm text-gray-400">You haven&apos;t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8 divide-y divide-gray-50">
      {orders.map((order) => (
        <Link
          key={order._id}
          href={`/tracker/${order._id}`}
          className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-gray-900 font-mono">{order.orderNumber}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                {STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(order.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}{order.itemCount} item{order.itemCount === 1 ? '' : 's'}
            </p>
          </div>
          <p className="text-sm font-bold text-gray-700 flex-shrink-0">Rs. {order.total.toLocaleString()}</p>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </Link>
      ))}
    </div>
  );
}

export default function TrackerPage() {
  const router = useRouter();
  const member = useLoyaltyStore((s) => s.member);
  const [orderId, setOrderId] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) { setError('Please enter your order number.'); return; }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${trimmed}`);
      if (!res.ok) {
        setError('Order not found. Please check your order number and try again.');
        return;
      }
      const data = await res.json();
      // Navigate to the dynamic tracker page using MongoDB _id
      router.push(`/tracker/${data._id}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className={`w-full mx-auto ${member ? 'max-w-lg' : 'max-w-md'}`}>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Track Your Order</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          {member ? 'Your recent orders, or look up any order below' : 'Enter your order number to see real-time updates'}
        </p>

        {member && (
          <>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Orders</h2>
            <MyOrdersPanel />
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400">or track a different order</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
          </>
        )}

        {/* Search form */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => { setOrderId(e.target.value); setError(''); }}
              placeholder="e.g. CEY123456"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900
                         placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400
                         transition-all font-mono tracking-wider uppercase"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-medium px-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold text-sm
                       hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching…' : 'Track Order'}
          </button>
        </form>

        {/* Helper */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Your order number was shown on the confirmation page and starts with{' '}
          <span className="font-mono font-semibold text-gray-600">CEY</span>
        </p>
      </div>
    </main>
  );
}