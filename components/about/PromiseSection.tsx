import { Flame, Bike, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function PromiseSection() {
  const promises = [
    {
      title: 'Hot Food',
      text: 'Served fresh and piping hot, every single time.',
      icon: Flame,
    },
    {
      title: 'Fast Delivery',
      text: 'Quick and reliable service straight to your door.',
      icon: Bike,
    },
    {
      title: 'Authentic Taste',
      text: 'The true taste of Sri Lanka in every bite.',
      icon: UtensilsCrossed,
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white p-8 md:p-12 shadow-2xl">
          {/* Decorative glow circles */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          {/* Header */}
          <div className="relative text-center mb-14">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Sparkles className="w-9 h-9" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Our Promise
            </h2>

            <p className="mt-3 text-white/85 max-w-2xl mx-auto text-sm md:text-base">
              Every meal from Ceylon Curry Pot is built around quality,
              authenticity, and dependable service.
            </p>
          </div>

          {/* Promise cards */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {promises.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-full bg-white text-red-600 flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>

                  <p className="text-sm text-white/85 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}