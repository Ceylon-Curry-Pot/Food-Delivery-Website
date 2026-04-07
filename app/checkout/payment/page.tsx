import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import CardDetailsForm from '@/components/checkout/CardDetailsForm';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_380px] gap-8">
        <section className="space-y-6">
          <CheckoutHeader
            backHref="/checkout"
            title="Payment"
            subtitle="Choose your payment method"
          />

          <PaymentMethodSelector />
          <CardDetailsForm />
        </section>

        <aside>
          <OrderSummaryCard buttonText="Pay Rs. 3,700" href="/checkout/success" />
        </aside>
      </div>
    </main>
  );
}
