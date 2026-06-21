export default function ContactHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-10 h-0.5 bg-white/70" />
            <span className="text-xs font-semibold tracking-[0.22em] uppercase">
              Contact Us
            </span>
            <span className="w-10 h-0.5 bg-white/70" />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-5 drop-shadow-sm">
            Have a Question?
            <br />
            <span className="text-white/90">We&apos;re Here to Help.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base leading-relaxed">
            Reach out via the form below or connect with us directly.
            Our team is ready to make your experience memorable.
          </p>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-12 bg-gray-50 rounded-t-[40px]" />
      </div>
    </section>
  );
}