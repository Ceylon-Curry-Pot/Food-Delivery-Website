export default function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-0.5 bg-white/70" />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase">
              Our Story
            </span>
            <span className="w-10 h-0.5 bg-white/70" />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5 drop-shadow-sm">
            Authentic Taste.
            <br />
            <span className="text-white/90">Zero Compromise.</span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base leading-relaxed">
            Our ambition is to preserve and share the traditional culinary
            miracle of Sri Lanka — the Pearl of the Indian Ocean — with
            every meal we serve.
          </p>
        </div>

        {/* Rounded white bottom */}
        <div className="absolute left-0 right-0 bottom-0 h-12 bg-white rounded-t-[40px]" />
      </div>
    </section>
  );
}