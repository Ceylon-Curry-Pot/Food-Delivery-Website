// components/menu/MenuDishCard.tsx
'use client';

import { ShoppingCart } from 'lucide-react';
import type { MenuDish } from '@/lib/menu';

type Props = MenuDish & {
  onAdd?: (dish: MenuDish) => void;
};

export default function MenuDishCard({
  id,
  name,
  description,
  price,
  image,
  badge,
  category,
  onAdd,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative h-52 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {badge}
          </span>
        )}

        <span className="absolute top-4 right-4 z-10 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Rs. {price.toLocaleString()}
        </span>

        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/60 rounded-bl-[80px] -translate-y-2 translate-x-2" />

        <div className="w-full h-full flex items-center justify-center p-6">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3">{name}</h3>

        <ul className="space-y-1.5 mb-4 flex-grow">
          {description.map((item, index) => (
            <li key={index} className="flex items-center text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={() =>
            onAdd?.({
              id,
              name,
              description,
              price,
              image,
              category,
              badge,
            })
          }
          className="mt-auto w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-full text-sm font-semibold
                     hover:bg-red-700 active:scale-[0.99] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          Add To Basket
        </button>
      </div>
    </div>
  );
}
