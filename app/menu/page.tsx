import MenuHero from '@/components/menu/MenuHero';
import MenuSection from '@/components/menu/MenuSection';

export default function MenuPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <MenuHero />

      <section className="relative -mt-14 z-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
            <MenuSection />
          </div>
        </div>
      </section>
    </main>
  );
}