'use client';

<<<<<<< HEAD
import DishCard from './DishCard';
import { featuredDishes } from '@/lib/data';
import SectionHeader from './SectionHeader';
import { useCartStore } from '@/components/global/useCartStore';
import Link from 'next/link';
import { Flame, Bike, Leaf, Star } from 'lucide-react';

const WHY_US = [
  { icon: Flame,  title: 'Authentic Spices',   desc: 'Ground fresh every morning from heritage recipes' },
  { icon: Leaf,   title: '100% Fresh',          desc: 'Sourced daily from local farmers & markets'       },
  { icon: Bike,   title: '35-min Delivery',     desc: 'Hot food, guaranteed fast'                        },
  { icon: Star,   title: '4.9★ Rated',          desc: 'Loved by 2,400+ customers island-wide'           },
];

export default function FeaturedDishes() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (id: string) => {
    const dish = featuredDishes.find((d) => d.id === id);
    if (!dish) return;
    addItem({ id: dish.id, name: dish.name, price: dish.price, image: dish.image });
  };

  return (
    <>
      {/* Featured dishes */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            tagline="Customer Favourites"
            title="Featured Dishes"
            description="Our most-loved Sri Lankan specialties, crafted with authentic recipes and the freshest ingredients."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDishes.slice(0, 4).map((dish) => (
              <DishCard key={dish.id} {...dish} onAdd={handleAdd} />
            ))}
          </div>
=======
import DishCard from './DishCard';
import SectionHeader from './SectionHeader';
import { useCartStore } from '@/components/global/useCartStore';
import Link from 'next/link';
import type { MenuDish } from '@/lib/menu';

type Props = {
  dishes: MenuDish[];
};

export default function FeaturedDishes({ dishes }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (id: string) => {
    const dish = dishes.find((d) => d.id === id);
    if (!dish) return;
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
    });
  };

  return (
    <section id="featured-dishes" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagline="Customer Favorites"
          title="Featured Dishes"
          description="Discover our most popular Sri Lankan specialties, loved by customers across the island"
        />

        {dishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {dishes.slice(0, 4).map((dish) => (
              <DishCard key={dish.id} {...dish} onAdd={handleAddToCart} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-sm font-semibold text-gray-700">No featured dishes available</p>
            <p className="mt-1 text-sm text-gray-400">Add available menu items in the admin dashboard.</p>
          </div>
        )}
>>>>>>> ea3da3f4bccdb84663326d1d73f0772260b0b102

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              View Full Menu
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why us strip */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <p className="font-heading text-white font-semibold text-sm">{title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
