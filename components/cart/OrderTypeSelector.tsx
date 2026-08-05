'use client';

import { Bike, Store } from 'lucide-react';
import { OrderType } from './cart.types';

type Props = {
  value: OrderType;
  onChange: (type: OrderType) => void;
};

export default function OrderTypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
      {([
        { key: 'delivery' as const, label: 'Delivery', icon: Bike },
        { key: 'pickup'   as const, label: 'Pick-Up',  icon: Store },
      ]).map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200
              ${active
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}