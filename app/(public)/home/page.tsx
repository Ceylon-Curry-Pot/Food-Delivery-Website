// app/page.tsx
import Hero from '@/components/global/Hero';
import FeaturedDishes from '@/components/home/FeaturedDishes';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { toMenuDish, type MenuItemRecord } from '@/lib/menu';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getFeaturedDishes() {
  await connectToDatabase();

  const items = await MenuItem.find({ available: true })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return items.map((item) => toMenuDish(item as MenuItemRecord));
}

export default async function HomePage() {
  const dishes = await getFeaturedDishes();

  return (
    <main>
      <Hero />
      <FeaturedDishes dishes={dishes} />
    </main>
  );
}
