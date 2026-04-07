import Link from 'next/link';

export default function OrderSummaryCard({
  buttonText,
  href,
}: {
  buttonText: string;
  href: string;
}) {
  return (
    <div className="bg-white rounded-2xl border p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-4">Order Summary</h3>

      <div className="space-y-3 text-sm border-b pb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. 3,500</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>Rs. 200</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg py-4">
        <span>Total</span>
        <span className="text-red-600">Rs. 3,700</span>
      </div>

      <Link
        href={href}
        className="block text-center bg-red-600 text-white py-3 rounded-full font-semibold hover:bg-red-700"
      >
        {buttonText}
      </Link>
    </div>
  );
}
