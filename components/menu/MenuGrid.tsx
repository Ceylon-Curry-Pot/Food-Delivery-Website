import MenuDishCard from './MenuDishCard';
import type { MenuDish } from '@/lib/menu';
import { SearchX } from 'lucide-react';

type Props = {
  dishes: MenuDish[];
};

export default function MenuGrid({ dishes }: Props) {
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7 text-gray-400" />
        </div>
        <p className="font-heading text-lg font-bold text-gray-700 mb-1">No dishes found</p>
        <p className="text-sm text-gray-400">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <MenuDishCard key={dish.id} {...dish} />
      ))}
    </div>
  );
}