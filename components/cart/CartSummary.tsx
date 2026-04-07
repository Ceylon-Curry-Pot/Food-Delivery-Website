type Props = {
    subtotal: number;
    deliveryFee: number;
    total: number;
};

export default function CartSummary({ subtotal, deliveryFee, total }: Props) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>Rs. {subtotal.toLocaleString()}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Delivery Fee</span>
        <span>Rs. {deliveryFee.toLocaleString()}</span>
      </div>

      <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
        <span>Total</span>
        <span>Rs. {total.toLocaleString()}</span>
      </div>

      <button className="w-full mt-4 rounded-full bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  );
}