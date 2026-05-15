'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package } from 'lucide-react';

export default function TrackerPage() {
  const router = useRouter();
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
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
            <Package className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Track Your Order</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Enter your order number to see real-time updates
        </p>

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