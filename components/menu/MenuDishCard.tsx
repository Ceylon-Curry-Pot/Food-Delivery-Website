'use client';

import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import type { MenuDish } from '@/lib/menu';
import { useCartStore } from '@/components/global/useCartStore';

const BADGE_STYLES: Record<string, string> = {
  Featured:   'bg-red-600 text-white',
  Popular:    'bg-amber-500 text-white',
  Vegetarian: 'bg-emerald-500 text-white',
  Premium:    'bg-gray-900 text-white',
};

export default function MenuDishCard({ id, name, description, price, image, badge, category }: MenuDish) {
  const addItem    = useCartStore((s) => s.addItem);
  const increaseQty = useCartStore((s) => s.increaseQty);
  const decreaseQty = useCartStore((s) => s.decreaseQty);
  const removeItem  = useCartStore((s) => s.removeItem);
  const quantity    = useCartStore((s) => s.items.find((i) => i.id === id)?.quantity ?? 0);

  const handleAdd = () => addItem({ id, name, price, image });

  const handleDecrease = () => {
    if (quantity <= 1) removeItem(id);
    else decreaseQty(id);
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
        <span className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          Rs. {price.toLocaleString()}
        </span>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-base font-bold text-gray-900 mb-3 leading-snug">{name}</h3>

        {/* Bullet-point description */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {description.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1" />
              {item}
            </li>
          ))}
        </ul>

        {/* Add button / stepper — full width at bottom */}
        <div className="mt-auto">
          {quantity === 0 ? (
            /* ── Add to Basket button ── */
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-[0.98] transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Basket
            </button>
          ) : (
            /* ── Quantity stepper — spans full width ── */
            <div className="flex items-center w-full bg-gray-50 border border-gray-200 rounded-full px-2 py-1.5">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all flex-shrink-0"
                aria-label={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
              >
                {quantity === 1
                  ? <Trash2 className="w-3.5 h-3.5" />
                  : <Minus  className="w-3.5 h-3.5" />}
              </button>

              <span className="flex-1 text-center font-bold text-gray-900 text-sm tabular-nums">
                {quantity} in basket
              </span>

              <button
                onClick={() => increaseQty(id)}
                className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shadow-sm flex-shrink-0"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}