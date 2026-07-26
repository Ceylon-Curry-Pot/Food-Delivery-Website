import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions – Ceylon Curry Pot',
  description: 'Terms and conditions for ordering from Ceylon Curry Pot.',
};

const LAST_UPDATED = 'May 2025';

export default function TermsPage() {
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
              Terms &amp; Conditions
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
              These Terms &amp; Conditions govern your use of the Ceylon Curry Pot website
              and the placement of orders through it. By placing an order, you agree to
              these terms in full. If you do not agree, please do not use our service.
              These terms are governed by the laws of the Democratic Socialist Republic of
              Sri Lanka.
            </p>
          </div>

          <PolicySection number="1" title="About Us">
            <p>
              Ceylon Curry Pot is a Sri Lankan restaurant operating a food delivery and
              pickup service from Liberty Plaza I Food Court, Colombo. We can be reached
              at{' '}
              <a href="mailto:ceyloncurrypot.lk@gmail.com"
                className="text-red-600 hover:underline">
                ceyloncurrypot.lk@gmail.com
              </a>{' '}
              or{' '}
              <a href="tel:0778282112" className="text-red-600 hover:underline">
                077 828 2112
              </a>.
            </p>
          </PolicySection>

          <PolicySection number="2" title="Placing an Order">
            <ul className="list-none space-y-2">
              {[
                'By placing an order you confirm you are at least 18 years old and authorised to use the payment method provided.',
                'All orders are subject to availability. If an item becomes unavailable after you order, we will contact you to offer a substitute or refund.',
                'You are responsible for providing accurate contact and delivery information. Ceylon Curry Pot is not liable for failed deliveries due to incorrect information.',
                'Order confirmation is sent via the on-screen tracker page. An order is only confirmed once you receive an order number (starting with CEY).',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection number="3" title="Pricing">
            <p>
              All prices are displayed in Sri Lankan Rupees (LKR) inclusive of applicable
              taxes. Prices may change without prior notice. The price charged will be the
              price displayed at the time you place your order. A delivery fee may be added
              at checkout for delivery orders.
            </p>
          </PolicySection>

          <PolicySection number="4" title="Payment">
            <p>We accept the following payment methods:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Cash on Delivery (COD) — paid to the delivery rider upon arrival',
                'Credit / Debit Card — processed securely by PayHere (Visa, Mastercard, AMEX)',
                'Digital Wallets — eZ Cash, mCash, FriMi, Genie via PayHere',
                'Internet Banking — Vishwa and other supported banks via PayHere',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Online payments are processed by{' '}
              <strong className="text-gray-900">PayHere (Private) Limited</strong>, Sri Lanka&rsquo;s
              Central Bank approved Internet Payment Gateway, regulated under CBSL PSD Direction
              No. 1 of 2018. By choosing an online payment method, you also agree to{' '}
              <a href="https://www.payhere.lk/legal" target="_blank" rel="noopener noreferrer"
                className="text-red-600 hover:underline">PayHere&rsquo;s Terms &amp; Conditions</a>.
              Ceylon Curry Pot never stores your card details.
            </p>
          </PolicySection>

          <PolicySection number="5" title="Delivery">
            <ul className="list-none space-y-2">
              {[
                'Estimated delivery times are provided as a guide only and are not guaranteed. Delivery times may be affected by order volume, weather, or traffic.',
                'Delivery is available within our supported delivery zone. Orders outside our zone will be cancelled with a full refund.',
                'Risk of the order passes to you upon delivery or collection from your door.',
                'If you are not present at the delivery address and cannot be reached, the rider will wait for a reasonable time (up to 5 minutes) then the order will be returned and a refund may not be issued for COD orders.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-gray-600">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </PolicySection>

          <PolicySection number="6" title="Cancellations & Refunds">
            <p>
              Cancellations are only possible before preparation begins, which is usually
              within 5–10 minutes of order confirmation. For the full policy, including
              refund timelines, complaint handling, and PayHere refund details, please
              visit our{' '}
              <Link href="/refund-policy" className="text-red-600 hover:underline font-medium">
                Cancellations &amp; Refunds Policy
              </Link>.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Allergen Disclaimer">
            <p>
              Our dishes are prepared in a kitchen that handles nuts, gluten, dairy, eggs,
              and shellfish. While we take reasonable precautions, we cannot guarantee
              that any item is completely free of allergens. If you have a severe allergy,
              please contact us before ordering at{' '}
              <a href="tel:0778282112" className="text-red-600 hover:underline">077 828 2112</a>.
              Ceylon Curry Pot is not liable for allergic reactions where allergen information
              was not disclosed to us.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Intellectual Property">
            <p>
              All content on this website — including the Ceylon Curry Pot logo, images,
              text, and design — is owned by Ceylon Curry Pot or licensed to us. You may
              not copy, reproduce, or distribute any content without our written permission.
            </p>
          </PolicySection>

          <PolicySection number="9" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by Sri Lankan law, Ceylon Curry Pot&rsquo;s total
              liability arising from or in connection with an order shall not exceed the
              value of that order. We are not liable for indirect, consequential, or special
              damages. Nothing in these terms limits liability for personal injury caused
              by our negligence or fraud.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Changes to These Terms">
            <p>
              We reserve the right to update these Terms at any time. The &ldquo;Last updated&rdquo;
              date reflects the most recent version. Continued use of the site after changes
              are posted constitutes your acceptance of the new terms.
            </p>
          </PolicySection>

          <PolicySection number="11" title="Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the laws of
              the Democratic Socialist Republic of Sri Lanka. Any disputes shall be subject
              to the exclusive jurisdiction of the courts of Sri Lanka.
            </p>
          </PolicySection>

        </div>

        <div className="mt-8 text-center">
          <Link href="/privacy"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
            Also read our Privacy Policy →
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