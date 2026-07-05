'use client';

import { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import Image from 'next/image';

export type DishCardProps = {
  id: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  badge?: string;
};

type Props = DishCardProps & { onAdd?: (id: string) => void };

export default function DishCard({ id, name, description, price, image, badge = '', onAdd }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd?.(id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const shortDesc = Array.isArray(description) ? description.join(', ') : description;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-gray-50">
        {badge && (
          <span
            className={`absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
              badge === 'Unavailable' ? 'bg-gray-500 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {badge}
          </span>
        )}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 mb-2 leading-snug">
          {name}
        </h3>

        <p className="text-sm text-gray-500 mb-5 flex-1 line-clamp-2">
          {shortDesc}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
          <div className="text-red-600 font-bold text-lg">
            <span className="text-xs font-semibold mr-0.5">Rs.</span>
            <span>{price.toLocaleString()}</span>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm
              ${added
                ? 'bg-emerald-500 text-white scale-95'
                : 'bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95'
              }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {added ? 'Added!' : 'Order'}
          </button>
        </div>
      </div>
    </div>
  );
}