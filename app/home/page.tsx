// app/page.tsx
import Hero from '@/components/global/Hero';
import FeaturedDishes from '@/components/home/FeaturedDishes';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedDishes />
    </main>
  );
}