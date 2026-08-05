'use client';

import { ShoppingBag } from 'lucide-react';
import { useCartStore, selectTotalItems } from '../global/useCartStore';

export default function CartButton({ onClick }: { onClick: () => void }) {
  const totalItems = useCartStore(selectTotalItems);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200"
      aria-label="Open basket"
    >
      <ShoppingBag className="w-4.5 h-4.5" />
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full h-[18px] w-[18px] flex items-center justify-center text-[10px] font-bold shadow-sm">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}