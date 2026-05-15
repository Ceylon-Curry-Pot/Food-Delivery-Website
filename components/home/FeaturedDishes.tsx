'use client';

import DishCard from './DishCard';
import { featuredDishes } from '@/lib/data';
import SectionHeader from './SectionHeader';
import { useCartStore } from '@/components/global/useCartStore';
import Link from 'next/link';

export default function FeaturedDishes() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (id: string) => {
    const dish = featuredDishes.find((d) => d.id === id);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredDishes.slice(0, 4).map((dish) => (
            <DishCard key={dish.id} {...dish} onAdd={handleAddToCart} />
          ))}
        </div>

        <div className="text-center mt-14">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-full text-base font-semibold
                       hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="text-gray-400 text-sm mt-3">
            Explore our complete selection of authentic Sri Lankan dishes
          </p>
        </div>
      </div>
    </section>
  );
}