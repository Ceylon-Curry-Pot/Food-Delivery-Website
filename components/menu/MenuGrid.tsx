// components/menu/MenuGrid.tsx
import type { DishCardProps } from '@/components/home/DishCard';
import MenuDishCard from './MenuDishCard';

type Props = {
  dishes: DishCardProps[];
  onAdd: (id: string) => void;
};

export default function MenuGrid({ dishes, onAdd }: Props) {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {dishes.map((dish) => (
        <MenuDishCard key={dish.id} {...dish} onAdd={onAdd} />
      ))}
    </div>
  );
}