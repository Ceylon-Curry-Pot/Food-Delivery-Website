import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy – Ceylon Curry Pot',
  description: 'How Ceylon Curry Pot collects, uses and protects your personal data.',
};

const LAST_UPDATED = 'May 2025';

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center text-white">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-0.5 bg-white/70" />
              <span className="text-xs font-semibold tracking-[0.22em] uppercase">Legal</span>
              <span className="w-8 h-0.5 bg-white/70" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              Privacy Policy
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

          {/* Intro */}
          <div>
            <p className="text-gray-600 leading-relaxed">
              Ceylon Curry Pot (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website{' '}
              <span className="font-medium text-gray-900">ceyloncurrypot.lk</span> and processes
              online food orders. This Privacy Policy explains what personal information we collect
              when you use our site or place an order, how we use it, and your rights under
              Sri Lanka&rsquo;s Personal Data Protection Act No. 9 of 2022 (&ldquo;PDPA&rdquo;).
            </p>
          </div>

          <PolicySection number="1" title="Information We Collect">
            <p>When you place an order or contact us, we may collect:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Full name',
                'Phone number',
                'Email address',
                'Delivery address',
                'Order details (items, quantities, special instructions)',
                'Payment confirmation data (we do not store card numbers — see Section 4)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-600">
              We also automatically collect standard server logs (IP address, browser type,
              pages visited) for security and analytics. We do not use tracking cookies for
              advertising.
            </p>
          </PolicySection>

          <PolicySection number="2" title="How We Use Your Information">
            <p>We use your personal data to:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Process and fulfil your food order',
                'Contact you about your order status (SMS / phone call / email)',
                'Calculate and collect payment',
                'Prevent fraud and ensure platform security',
                'Improve our menu and service based on aggregate feedback',
                'Comply with legal obligations under Sri Lankan law',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-600">
              The lawful basis for processing is <strong>contract performance</strong> — we need
              your information to deliver the service you requested.
            </p>
          </PolicySection>

          <PolicySection number="3" title="Sharing Your Information">
            <p className="text-gray-600">
              We only share your data with third parties where necessary to fulfil your order:
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                <p className="font-semibold text-gray-900 mb-1">PayHere (Private) Limited</p>
                <p className="text-sm text-gray-500">
                  Our payment processor. Your name, phone, email, and order amount are transmitted
                  to PayHere to process your card or wallet payment. PayHere is regulated by the
                  Central Bank of Sri Lanka under PSD Direction No. 1 of 2018. View their policies at{' '}
                  <a href="https://www.payhere.lk/legal" target="_blank" rel="noopener noreferrer"
                    className="text-red-600 hover:underline">payhere.lk/legal</a> and{' '}
                  <a href="https://www.payhere.lk/privacy" target="_blank" rel="noopener noreferrer"
                    className="text-red-600 hover:underline">payhere.lk/privacy</a>.
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                <p className="font-semibold text-gray-900 mb-1">Our Delivery Partners</p>
                <p className="text-sm text-gray-500">
                  Your name, phone number, and delivery address are shared with our delivery
                  riders solely for the purpose of completing your delivery.
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">
              We do <strong>not</strong> sell, rent, or trade your personal data to any
              third party for marketing purposes.
            </p>
          </PolicySection>

          <PolicySection number="4" title="Payment Security">
            <p className="text-gray-600">
              All online payments are processed by PayHere. We <strong>never receive, store,
              or have access to</strong> your full card number, CVV, or PIN. PayHere operates
              under PCI-DSS compliant infrastructure. Your financial data is protected by
              PayHere&rsquo;s own security measures.
            </p>
            <p className="mt-3 text-gray-600">
              Cash on Delivery orders involve no digital payment processing on our end beyond
              recording the order total.
            </p>
          </PolicySection>

          <PolicySection number="5" title="Data Retention">
            <p className="text-gray-600">
              Order records (including your contact and delivery information) are retained for
              a minimum of <strong>5 years</strong> to comply with Sri Lankan commercial and
              tax law requirements. You may request deletion of your personal data at any time
              subject to these legal retention obligations.
            </p>
          </PolicySection>

          <PolicySection number="6" title="Your Rights Under the PDPA">
            <p className="text-gray-600">
              Under Sri Lanka&rsquo;s Personal Data Protection Act No. 9 of 2022, you have the
              right to:
            </p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Access the personal data we hold about you',
                'Correct inaccurate data',
                'Request deletion of your data (subject to legal retention requirements)',
                'Object to processing of your data',
                'Withdraw consent where processing is based on consent',
                'Lodge a complaint with the Data Protection Authority of Sri Lanka',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-600">
              To exercise any of these rights, contact us at{' '}
              <a href="mailto:ceyloncurrypot.lk@gmail.com"
                className="text-red-600 hover:underline font-medium">
                ceyloncurrypot.lk@gmail.com
              </a>.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Cookies">
            <p className="text-gray-600">
              Our website uses only <strong>essential cookies</strong> required for the site to
              function (session management, cart state). We do not use advertising or tracking
              cookies, and we do not share cookie data with third parties.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Changes to This Policy">
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date
              at the top of this page reflects the most recent revision. Continued use of our
              site after changes constitutes acceptance of the updated policy.
            </p>
          </PolicySection>

          <PolicySection number="9" title="Contact Us">
            <p className="text-gray-600">
              For any privacy-related questions or to exercise your rights:
            </p>
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 p-5 space-y-2 text-sm">
              <p className="font-semibold text-gray-900">Ceylon Curry Pot</p>
              <p className="text-gray-600">Liberty Plaza I Food Court, Colombo, Sri Lanka</p>
              <p>
                <a href="mailto:ceyloncurrypot.lk@gmail.com"
                  className="text-red-600 hover:underline">
                  ceyloncurrypot.lk@gmail.com
                </a>
              </p>
              <p>
                <a href="tel:0778282112" className="text-red-600 hover:underline">
                  077 828 2112
                </a>
              </p>
            </div>
          </PolicySection>

        </div>

        <div className="mt-8 text-center">
          <Link href="/terms"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
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
        <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
          {number}
        </div>
        <h2 className="font-heading text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="pl-10 text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}