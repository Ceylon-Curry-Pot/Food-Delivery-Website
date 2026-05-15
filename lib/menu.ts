import type { DishCardProps } from '@/components/home/DishCard';

export type MenuCategory =
  | 'All'
  | 'Rice & Curry'
  | 'Kottu'
  | 'Biriyani'
  | 'Hoppers'
  | 'Seafood'
  | 'Vegetarian';

export const menuCategories: MenuCategory[] = [
  'All',
  'Rice & Curry',
  'Kottu',
  'Biriyani',
  'Hoppers',
  'Seafood',
  'Vegetarian',
];

export const dishCategoryById: Record<string, Exclude<MenuCategory, 'All'>> = {
  'red-pork-yellow-rice': 'Rice & Curry',
  'black-pork-white-rice': 'Rice & Curry',
  'chicken-biryani': 'Biriyani',
  'veggie-kottu': 'Vegetarian',
  'chicken-kottu': 'Kottu',
  'beef-kottu': 'Kottu',
  'egg-hoppers': 'Hoppers',
  'fish-curry-rice': 'Seafood',
  'lamprais': 'Rice & Curry',
  'pol-sambol-rice': 'Vegetarian',
};

export function getDishCategory(dish: DishCardProps): Exclude<MenuCategory, 'All'> {
  return dishCategoryById[dish.id] ?? 'Rice & Curry';
}