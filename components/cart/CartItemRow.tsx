'use client';

import { Trash2, Minus, Plus } from 'lucide-react';
import { CartItem } from './cart.types';

type Props = {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-colors">
      {/* Thumbnail */}
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name row */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">
            {item.name}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
            aria-label="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Price + qty on same row */}
        <div className="flex items-center justify-between mt-2">
          {/* Qty stepper */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onDecrease(item.id)}
              className="w-6 h-6 rounded-full border border-gray-200 hover:border-red-300 flex items-center justify-center transition-colors"
            >
              <Minus className="w-2.5 h-2.5 text-gray-600" />
            </button>
            <span className="font-bold text-gray-900 text-sm w-5 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onIncrease(item.id)}
              className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
            >
              <Plus className="w-2.5 h-2.5 text-white" />
            </button>
          </div>

          {/* Line total */}
          <p className="font-bold text-red-600 text-sm">
            Rs. {(item.price * item.quantity).toLocaleString()}
          </p>
        </div>

        {/* Unit price hint */}
        <p className="text-[11px] text-gray-400 mt-0.5">
          Rs. {item.price.toLocaleString()} each
        </p>
      </div>
    </div>
  );
}