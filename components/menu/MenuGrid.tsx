import MenuDishCard from './MenuDishCard';
import type { MenuDish } from '@/lib/menu';

type Props = {
  dishes: MenuDish[];
  onAdd?: (dish: MenuDish) => void;
};

export default function MenuGrid({ dishes, onAdd }: Props) {
  if (dishes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm font-semibold text-gray-700">No menu items found</p>
        <p className="mt-1 text-sm text-gray-400">Try another search or check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <MenuDishCard
          key={dish.id}
          {...dish}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
