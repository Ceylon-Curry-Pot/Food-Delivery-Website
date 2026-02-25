import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';

export type DishCardProps = {
  id: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  badge?: string;
  onAdd?: (id: string) => void;
};

export default function DishCard({
  id,
  name,
  description,
  price,
  image,
  badge = 'Featured',
  onAdd,
}: DishCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image Area */}
      <div className="relative h-52 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Badge */}
        {badge && (
          <span className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {badge}
          </span>
        )}

        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/60 rounded-bl-[80px] -translate-y-2 translate-x-2"></div>

        {/* Food Image */}
        <div className="w-full h-full flex items-center justify-center p-6">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Dish Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3">{name}</h3>

        {/* Description List */}
        <ul className="space-y-1.5 mb-4 flex-grow">
          {description.map((item, index) => (
            <li key={index} className="flex items-center text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2.5 flex-shrink-0"></span>
              {item}
            </li>
          ))}
        </ul>

        {/* Price & Add Button */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-gray-50">
          <div>
            <span className="text-xs text-gray-400 block">Rs.</span>
            <span className="text-2xl font-bold text-red-600 leading-tight">
              {price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => onAdd?.(id)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium 
                       hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
