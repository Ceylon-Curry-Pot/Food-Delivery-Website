import ConfirmationHero from '@/components/checkout/ConfirmationHero';
import ConfirmationDetails from '@/components/checkout/ConfirmationDetails';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <ConfirmationHero />
        <ConfirmationDetails />
      </div>
    </main>
  );
}
