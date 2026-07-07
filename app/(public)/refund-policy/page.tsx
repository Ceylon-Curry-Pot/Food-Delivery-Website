import Link from 'next/link';

export const metadata = {
  title: 'Cancellations & Refunds Policy – Ceylon Curry Pot',
  description:
    'Cancellations and refund policy for Ceylon Curry Pot orders, including PayHere refunds and complaint timelines.',
};

const LAST_UPDATED = 'July 7, 2026';

export default function RefundPolicyPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-linear-to-r from-red-600 via-red-500 to-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center text-white">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-0.5 bg-white/70" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">Legal</span>
              <span className="w-8 h-0.5 bg-white/70" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              Cancellations &amp; Refunds Policy
            </h1>
            <p className="text-white/90 text-sm max-w-xl mx-auto">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-12 bg-gray-50 rounded-t-[40px]" />
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          <div>
            <p className="text-gray-600 leading-relaxed">
              Due to the perishable nature of food, our cancellation and refund rules are
              designed to protect food quality while keeping the process clear for online,
              cash-on-delivery, and PayHere payments.
            </p>
          </div>

          <PolicySection number="1" title="Cancellations & Refunds">
            <p>Due to the perishable nature of food:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Orders cannot be cancelled once preparation has begun, which is typically within 5–10 minutes of order confirmation.',
                'If we are unable to fulfil an order for any reason, a full refund will be issued to the original payment method within 5–7 business days.',
                'Refunds for online or card payments made via PayHere are processed back to the original card or wallet. Refunds for cash-on-delivery orders are handled manually by our team.',
                'Complaints about order quality or missing items must be raised within 30 minutes of delivery by calling 077 828 2112 or emailing ceyloncurrypot.lk@gmail.com.',
                'We reserve the right to offer a replacement order or a partial/full refund at our discretion for valid complaints.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection number="2" title="Need Help?">
            <p>
              For questions about this policy or a specific order, contact Ceylon Curry Pot at{' '}
              <a href="tel:0778282112" className="text-red-600 hover:underline font-medium">
                077 828 2112
              </a>{' '}
              or{' '}
              <a
                href="mailto:ceyloncurrypot.lk@gmail.com"
                className="text-red-600 hover:underline font-medium"
              >
                ceyloncurrypot.lk@gmail.com
              </a>.
            </p>
          </PolicySection>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/terms"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Also read our Terms &amp; Conditions →
          </Link>
        </div>
      </div>
    </main>
  );
}

function PolicySection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
          {number}
        </div>
        <h2 className="font-heading text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="pl-10 text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}