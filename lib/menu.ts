// lib/menu.ts
import type { DishCardProps } from '@/components/home/DishCard';

export type MenuCategory =
  | 'All'
  | "Rice & Curry"
  | 'Fried Rice'
  | 'Kottu'
  | 'Biriyani'
  | 'Seafood'
  | 'Hoppers'
  | 'Beverages';

export const menuCategories: MenuCategory[] = [
  'All',
  'Rice & Curry',
  'Fried Rice',
  'Kottu',
  'Biriyani',
  'Seafood',
  'Hoppers',
  'Beverages',
];

// Map dish id -> category
export const dishCategoryById: Record<string, Exclude<MenuCategory, 'All'>> = {
  'red-pork-yellow-rice': 'Rice & Curry',
  'black-pork-white-rice': 'Rice & Curry',
  'chicken-biryani': 'Biriyani',
  'veggie-kottu': 'Kottu',
};

// helper (safe default)
export function getDishCategory(dish: DishCardProps) {
  return dishCategoryById[dish.id] ?? 'Rice & Curry';
}