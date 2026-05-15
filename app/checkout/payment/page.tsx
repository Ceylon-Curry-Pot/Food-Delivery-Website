import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import CardDetailsForm from '@/components/checkout/CardDetailsForm';
import OrderSummaryCard from '@/components/checkout/OrderSummaryCard';

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <section className="space-y-5">
            <CheckoutHeader
              backHref="/checkout"
              title="Payment"
              subtitle="Choose how you'd like to pay"
            />
            <PaymentMethodSelector />
            <CardDetailsForm />
          </section>

          <aside>
            <OrderSummaryCard buttonText="Place Order →" href="/checkout/success" />
          </aside>
        </div>
      </div>
    </main>
  );
}