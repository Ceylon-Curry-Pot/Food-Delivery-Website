'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../global/useCartStore';

type Props = {
  onClick: () => void;
};

export default function CartButton({ onClick }: Props) {
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-11 h-11 rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 transition-all"
    >
      <ShoppingCart className="w-5 h-5" />

      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-semibold shadow-sm">
          {totalItems}
        </span>
      )}
    </button>
  );
}