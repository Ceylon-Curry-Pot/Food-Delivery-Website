'use client';

import { X } from 'lucide-react';
import OrderTypeSelector from './OrderTypeSelector';
import CartItemRow from './CartItemRow';
import OrderNote from './OrderNote';
import CartSummary from './CartSummary';
import { useCartStore } from '../global/useCartStore';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartModal({ isOpen, onClose }: Props) {
  const {
    items,
    note,
    orderType,
    subtotal,
    deliveryFee,
    total,
    setNote,
    setOrderType,
    increaseQty,
    decreaseQty,
    removeItem,
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Basket
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Type */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Order Type
            </h3>
            <OrderTypeSelector
              value={orderType}
              onChange={setOrderType}
            />
          </div>

          {/* Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Items
            </h3>

            {items.length === 0 ? (
              <div className="text-center py-10 border rounded-2xl bg-gray-50">
                <p className="text-gray-500">
                  Your basket is empty
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onIncrease={increaseQty}
                    onDecrease={decreaseQty}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Order Note */}
          <OrderNote note={note} onChange={setNote} />

          {/* Summary */}
          <CartSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}