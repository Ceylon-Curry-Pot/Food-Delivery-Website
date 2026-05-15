'use client';

import {
  useCartStore,
  selectSubtotal,
  selectDeliveryFee,
  selectTotal,
} from '@/components/global/useCartStore';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function OrderSummaryCard({
  buttonText,
  href,
}: {
  buttonText: string;
  href: string;
}) {
  const items       = useCartStore((s) => s.items);
  const orderType   = useCartStore((s) => s.orderType);
  const subtotal    = useCartStore(selectSubtotal);
  const deliveryFee = useCartStore(selectDeliveryFee);
  const total       = useCartStore(selectTotal);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>

      {items.length > 0 ? (
        <div className="space-y-3 mb-5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-gray-700 flex-shrink-0">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-gray-400 mb-4">
          <ShoppingBag className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No items in basket</p>
        </div>
      )}

      <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span className="font-medium text-gray-700">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>{orderType === 'pickup' ? 'Pickup (no fee)' : 'Delivery Fee'}</span>
          <span className="font-medium text-gray-700">
            {deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-base py-4 border-t border-gray-100 mt-2">
        <span>Total</span>
        <span className="text-red-600">Rs. {total.toLocaleString()}</span>
      </div>

      <Link
        href={href}
        className="block text-center bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm
                   hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm hover:shadow-md"
      >
        {buttonText}
      </Link>

      <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secure checkout
      </p>
    </div>
  );
}