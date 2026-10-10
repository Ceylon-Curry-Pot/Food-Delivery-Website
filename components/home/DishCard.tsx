'use client';

import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/components/global/useCartStore';

export type DishCardProps = {
  id: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  badge?: string;
};

const BADGE_STYLES: Record<string, string> = {
  Featured:   'bg-red-600 text-white',
  Popular:    'bg-amber-500 text-white',
  Vegetarian: 'bg-emerald-500 text-white',
  Premium:    'bg-gray-900 text-white',
};

export default function DishCard({ id, name, description, price, image, badge = '' }: DishCardProps) {
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
        <ul className="space-y-1.5 mb-4 flex-1">
          {description.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1" />
              {item}
            </li>
          ))}
        </ul>

        {/* Price + Add/Stepper */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto gap-3">
          <div className="flex-shrink-0">
            <span className="text-[10px] text-gray-400 font-medium">RS. </span>
            <span className="text-xl font-bold text-gray-900">{price.toLocaleString()}</span>
          </div>

          {quantity === 0 ? (
            /* ── Add button ── */
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-95 transition-all shadow-sm flex-shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            /* ── Quantity stepper ── */
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 text-gray-500 transition-all"
                aria-label={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
              >
                {quantity === 1
                  ? <Trash2 className="w-3 h-3" />
                  : <Minus  className="w-3 h-3" />}
              </button>

              <span className="font-bold text-gray-900 text-sm w-5 text-center tabular-nums">
                {quantity}
              </span>

              <button
                onClick={() => increaseQty(id)}
                className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}