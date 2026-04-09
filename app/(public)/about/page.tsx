import AboutHero from '@/components/about/AboutHero';
import SpecialitiesSection from '@/components/about/SpecialitiesSection';
import PromiseSection from '@/components/about/PromiseSection';
import CTASection from '@/components/about/CTASection';

export default function AboutPage() {
  return (
    <main className="bg-gray-50">
      <section className="relative overflow-hidden">
        {/* Hero */}
        <AboutHero />

        {/* First content block pulled over the curve */}
        <div className="relative -mt-12 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpecialitiesSection />
        </div>
      </section>

      {/* Remaining sections */}
      <PromiseSection />
      <CTASection />
    </main>
  );
}