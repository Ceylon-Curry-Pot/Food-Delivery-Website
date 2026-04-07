import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ContactForm from '@/components/checkout/ContactForm';
import DeliveryAddressForm from '@/components/checkout/DeliveryAddressForm';
import AdditionalNotes from '@/components/checkout/AdditionalNotes';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_380px] gap-8">
        <section className="space-y-6">
          <CheckoutHeader
            backHref="/menu"
            title="Checkout"
            subtitle="Complete your order details"
            badge="Delivery"
          />

          <ContactForm />
          <DeliveryAddressForm />
          <AdditionalNotes />
        </section>

        <aside>
          <OrderSummaryCard buttonText="Continue to Payment" href="/checkout/payment" />
        </aside>
      </div>
    </main>
  );
}
