'use client';

import { X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderTypeSelector from './OrderTypeSelector';
import CartItemRow from './CartItemRow';
import OrderNote from './OrderNote';
import CartSummary from './CartSummary';
import {
  useCartStore,
  selectSubtotal,
  selectDeliveryFee,
  selectTotal,
  selectTotalItems,
} from '../global/useCartStore';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartModal({ isOpen, onClose }: Props) {
  const items        = useCartStore((s) => s.items);
  const note         = useCartStore((s) => s.note);
  const orderType    = useCartStore((s) => s.orderType);
  const setNote      = useCartStore((s) => s.setNote);
  const setOrderType = useCartStore((s) => s.setOrderType);
  const increaseQty  = useCartStore((s) => s.increaseQty);
  const decreaseQty  = useCartStore((s) => s.decreaseQty);
  const removeItem   = useCartStore((s) => s.removeItem);

  const subtotal    = useCartStore(selectSubtotal);
  const deliveryFee = useCartStore(selectDeliveryFee);
  const total       = useCartStore(selectTotal);
  const totalItems  = useCartStore(selectTotalItems);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-none">Your Basket</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {totalItems > 0
                      ? `${totalItems} item${totalItems > 1 ? 's' : ''}`
                      : 'Empty'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── Order type (compact pill) ── */}
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <OrderTypeSelector value={orderType} onChange={setOrderType} />
            </div>

            {/* ── Items (scrollable — gets all remaining height) ── */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2.5 min-h-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <ShoppingBag className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="font-semibold text-gray-500 text-sm mb-1">Your basket is empty</p>
                  <p className="text-xs text-gray-400">Add some dishes to get started</p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onIncrease={increaseQty}
                    onDecrease={decreaseQty}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {/* ── Footer: note + summary (pinned bottom) ── */}
            {items.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-100 px-5 pb-5 pt-3 space-y-3 bg-white">
                <OrderNote note={note} onChange={setNote} />
                <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}