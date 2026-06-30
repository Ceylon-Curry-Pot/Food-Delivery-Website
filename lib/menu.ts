export type MenuCategory = string;

export const menuCategories: MenuCategory[] = [
  'All',
  'Rice & Curry',
  'Kottu',
  'Fried Rice',
  'Dum Biryani',
  'Masala Biryani',
  'Roast Paan',
  'Pol Roti',
  'Meat Portions',
  'Vegetarian Portions',
  'Hoppers',
  'Desserts',
  'Beverages'
];

export type MenuDish = {
  id: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  category: Exclude<MenuCategory, 'All'>;
  badge?: string;
};

export type MenuItemRecord = {
  _id: string | { toString(): string };
  name: string;
  price: number;
  category: Exclude<MenuCategory, 'All'>;
  description?: string | string[];
  image?: string;
  available?: boolean;
};

const DEFAULT_MENU_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80';

export function splitMenuDescription(description?: string | string[]) {
  if (Array.isArray(description)) return description;

  return (description ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toMenuDish(item: MenuItemRecord): MenuDish {
  return {
    id: item._id.toString(),
    name: item.name,
    description: splitMenuDescription(item.description),
    price: item.price,
    image: item.image || DEFAULT_MENU_IMAGE,
    category: item.category,
    badge: item.available === false ? 'Unavailable' : undefined,
  };
}
