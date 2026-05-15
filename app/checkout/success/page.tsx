import ConfirmationHero from '@/components/checkout/ConfirmationHero';
import ConfirmationDetails from '@/components/checkout/ConfirmationDetails';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto px-4 space-y-5">
        <ConfirmationHero />
        <ConfirmationDetails />
      </div>
    </main>
  );
}