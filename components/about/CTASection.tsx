import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-50 via-white to-red-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white rounded-4xl shadow-2xl border border-gray-100 p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Ready to Savor the Authentic Flavors?
          </h2>

          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mb-10">
            Join thousands of food lovers who trust Ceylon Curry Pot for a premium Sri Lankan dining experience.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              href="/menu"
              className="px-8 py-4 rounded-full bg-red-600 text-white font-bold shadow-lg transform transition hover:scale-105 hover:bg-red-700"
            >
              Explore the Menu
            </Link>

            <Link
              href="/contact"
              className="px-8 py-4 rounded-full border-2 border-red-600 text-red-600 font-bold shadow-sm hover:bg-red-50 transform transition hover:scale-105"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}