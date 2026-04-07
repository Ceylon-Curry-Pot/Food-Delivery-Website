import MenuDishCard from './MenuDishCard';
import type { DishCardProps } from '@/components/home/DishCard';

type Props = {
  dishes: DishCardProps[];
  onAdd?: (dish: DishCardProps) => void;
};

export default function MenuGrid({ dishes, onAdd }: Props) {
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