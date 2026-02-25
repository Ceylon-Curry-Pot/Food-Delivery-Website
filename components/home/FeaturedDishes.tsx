'use client';

import DishCard from './DishCard';
import { featuredDishes } from '@/lib/data';
import SectionHeader from './SectionHeader';


export default function FeaturedDishes() {
  const handleAddToCart = (id: string) => {
    // TODO: Integrate with cart context/store
    console.log(`Added ${id} to cart`);
  };

  return (
    <section id="featured-dishes" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagline="Customer Favorites"
          title="Featured Dishes"
          description="Discover our most popular Sri Lankan specialties, loved by customers across the island"
        />

        {/* Dish Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredDishes.map((dish) => (
            <DishCard key={dish.id} {...dish} onAdd={handleAddToCart} />
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div className="text-center mt-14">
          <a
            href="/menu"
            className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-full text-base font-semibold
                       hover:bg-red-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View Full Menu
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <p className="text-gray-400 text-sm mt-3">
            Explore our complete selection of authentic Sri Lankan dishes
          </p>
        </div>
      </div>
    </section>
  );
}
