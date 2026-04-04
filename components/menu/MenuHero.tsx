// components/menu/MenuHero.tsx
export default function MenuHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center text-white">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase opacity-90">
            <span className="w-8 h-0.5 bg-white/70" />
            Full Menu
            <span className="w-8 h-0.5 bg-white/70" />
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            Our Complete Menu
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-2xl mx-auto text-white/90 text-sm md:text-base leading-relaxed">
            Explore our full selection of authentic Sri Lankan dishes, crafted
            with love and tradition.
          </p>
        </div>

        {/* Better curved white wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-[70px] md:h-[90px]"
            preserveAspectRatio="none"
          >
            <path
              fill="white"
              d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}