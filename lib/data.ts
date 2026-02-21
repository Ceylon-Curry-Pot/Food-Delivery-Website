import { DishCardProps } from "@/components/home/DishCard";

export const featuredDishes: DishCardProps[] = [
  {
    id: 'red-pork-yellow-rice',
    name: 'Red Pork Yellow Rice',
    description: ['Red pork boneless curry', '4 vegetable choices'],
    price: 1850,
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&q=80',
    badge: 'Featured',
  },
  {
    id: 'black-pork-white-rice',
    name: 'Black Pork White Rice',
    description: ['Black pork boneless curry', '4 vegetable choices'],
    price: 1750,
    image:
      'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=600&h=400&fit=crop&q=80',
    badge: 'Featured',
  },
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    description: ['Fragrant basmati rice', 'Tender chicken pieces'],
    price: 1650,
    image:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop&q=80',
    badge: 'Popular',
  },
  {
    id: 'veggie-kottu',
    name: 'Veggie Kottu Roti',
    description: ['Mixed vegetables', 'Chopped roti & egg'],
    price: 1250,
    image:
      'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop&q=80',
    badge: 'Vegetarian',
  },
];