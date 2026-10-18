import AboutHero from '@/components/about/AboutHero';
import SpecialitiesSection from '@/components/about/SpecialitiesSection';
import PromiseSection from '@/components/about/PromiseSection';
import CTASection from '@/components/about/CTASection';

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        {/* Hero */}
        <AboutHero />

        {/* First content block pulled over the curve */}
        <div className="relative mt-8 md:mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpecialitiesSection />
        </div>
      </section>

      {/* Remaining sections */}
      <PromiseSection />
      <CTASection />
    </div>
  );
}