'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';

export type DishCardProps = {
  id: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  badge?: string;
};

type Props = DishCardProps & { onAdd?: (id: string) => void };

const BADGE_STYLES: Record<string, string> = {
  Featured:   'bg-red-600 text-white',
  Popular:    'bg-amber-500 text-white',
  Vegetarian: 'bg-emerald-500 text-white',
  Premium:    'bg-gray-900 text-white',
};

export default function DishCard({ id, name, description, price, image, badge = '', onAdd }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd?.(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${BADGE_STYLES[badge] ?? 'bg-gray-600 text-white'}`}>
            {badge}
          </span>
        )}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-base font-bold text-gray-900 mb-2.5 leading-snug">{name}</h3>

        <ul className="space-y-1 mb-4 flex-1">
          {description.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <div>
            <span className="text-[10px] text-gray-400 font-medium">RS.</span>
            <span className="text-xl font-bold text-gray-900 ml-0.5">{price.toLocaleString()}</span>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shadow-sm
              ${added
                ? 'bg-emerald-500 text-white scale-95'
                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-95'
              }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {added ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}