export default function ContactHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-10 h-0.5 bg-white/70" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">
              Contact Us
            </span>
            <div className="w-10 h-0.5 bg-white/70" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Have a Question?
            <br />
            We’re Here to Help.
          </h1>

          <p className="mt-5 max-w-3xl mx-auto text-sm md:text-base text-white/90 leading-relaxed">
            Reach out via the form below or connect with us on social media. 
            Our team is ready to answer your questions and make your visit memorable.
          </p>
        </div>

        <div className="absolute left-0 right-0 bottom-0 h-12 bg-white rounded-t-[40px]" />
      </div>
    </section>
  );
}