'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

type Props = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export default function CartSummary({ subtotal, deliveryFee, total }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-4 space-y-2.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-medium text-gray-800">Rs. {subtotal.toLocaleString()}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          {deliveryFee === 0 ? 'Pickup (no fee)' : 'Delivery Fee'}
        </span>
        <span className="font-medium text-gray-800">
          {deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee.toLocaleString()}`}
        </span>
      </div>

      <div className="border-t border-gray-100 pt-2.5 flex justify-between">
        <span className="font-bold text-gray-900">Total</span>
        <span className="font-bold text-red-600 text-lg">
          Rs. {total.toLocaleString()}
        </span>
      </div>

      <button
        onClick={() => router.push('/checkout')}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-red-600 text-white py-3.5 font-semibold text-sm
                   hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
      >
        Proceed to Checkout
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}