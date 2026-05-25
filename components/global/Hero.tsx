import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center text-white">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-0.5 bg-white/70" />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase">
              Authentic Sri Lankan Flavours
            </span>
            <span className="w-10 h-0.5 bg-white/70" />
          </div>

          {/* Headline */}
          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-sm">
            The Soul of Ceylon
            <br />
            <span className="text-white/90">on Your Table</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/85 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Handcrafted recipes passed through generations — rich curries,
            fragrant rice and bold spice blends, delivered fresh to your door.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-base hover:bg-red-50 transition-all shadow-xl hover:-translate-y-0.5 active:scale-95"
            >
              Order Now
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 bg-white/15 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-base hover:bg-white/25 transition-all"
            >
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="inline-flex items-center bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl overflow-hidden">
            {[
              { value: '4.9★',   label: 'Rating'       },
              { value: '2,400+', label: 'Customers'     },
              { value: '35 min', label: 'Avg Delivery'  },
            ].map(({ value, label }, i) => (
              <div
                key={label}
                className={`px-8 py-4 text-center ${i < 2 ? 'border-r border-white/20' : ''}`}
              >
                <p className="font-heading text-2xl font-bold text-white">{value}</p>
                <p className="text-white/70 text-xs tracking-wide mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rounded white bottom — same as AboutHero */}
        <div className="absolute left-0 right-0 bottom-0 h-12 bg-white rounded-t-[40px]" />
      </div>
    </section>
  );
}