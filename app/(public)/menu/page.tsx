import MenuHero from '@/components/menu/MenuHero';
import MenuSection from '@/components/menu/MenuSection';
import connectToDatabase from '@/lib/mongodb';
import MenuItem from '@/lib/models/MenuItem';
import { getMenuCategories } from '@/lib/menuCategories';
import { toMenuDish, type MenuItemRecord } from '@/lib/menu';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getMenuDishes() {
  await connectToDatabase();

  const items = await MenuItem.find({ available: true })
    .sort({ category: 1, name: 1 })
    .lean();

  return items.map((item) => toMenuDish(item as MenuItemRecord));
}

async function getCategories() {
  return getMenuCategories();
}

export default async function MenuPage() {
  const [dishes, categories] = await Promise.all([getMenuDishes(), getCategories()]);

  return (
    <main className="bg-gray-50 min-h-screen">
      <MenuHero />

      <section className="relative -mt-14 z-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            <MenuSection dishes={dishes} categories={categories} />
          </div>
        </div>
      </section>
    </main>
  );
}
