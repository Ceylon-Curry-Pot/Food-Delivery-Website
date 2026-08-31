'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { toast } from 'sonner';
import Image from 'next/image';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import ContactForm, { type ContactFormHandle } from '@/components/checkout/ContactForm';
import DeliveryAddressForm, { type DeliveryAddressFormHandle } from '@/components/checkout/DeliveryAddressForm';
import AdditionalNotes from '@/components/checkout/AdditionalNotes';
import {
  useCartStore,
  selectSubtotal,
  selectDeliveryFee,
  selectTotal,
} from '@/components/global/useCartStore';
import { useLoyaltyStore } from '@/components/loyalty/useLoyaltyStore';
import { awardOrderPoints, previewOrderPoints, type PointsPreview } from '@/lib/loyaltyApi';
import { ShoppingBag, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function CheckoutPage() {
  const router      = useRouter();
  const contactRef  = useRef<ContactFormHandle>(null);
  const addressRef  = useRef<DeliveryAddressFormHandle>(null);
  const [placing, setPlacing] = useState(false);
  const [payMethod, setPayMethod] = useState<'cod' | 'card' | 'wallet'>('cod');

  const items       = useCartStore((s) => s.items);
  const orderType   = useCartStore((s) => s.orderType);
  const note        = useCartStore((s) => s.note);
  const clearCart   = useCartStore((s) => s.clearCart);
  const subtotal    = useCartStore(selectSubtotal);
  const deliveryFee = useCartStore(selectDeliveryFee);
  const total       = useCartStore(selectTotal);

  const member    = useLoyaltyStore((s) => s.member);
  const setMember = useLoyaltyStore((s) => s.setMember);

  const [pointsPreview, setPointsPreview] = useState<PointsPreview | null>(null);

  // Points are earned on the food subtotal only — the delivery fee doesn't
  // count — so preview against `subtotal`, matching what the backend awards.
  useEffect(() => {
    if (!member || subtotal <= 0) {
      setPointsPreview(null);
      return;
    }

    let cancelled = false;
    previewOrderPoints(subtotal).then((preview) => {
      if (!cancelled) setPointsPreview(preview);
    });

    return () => {
      cancelled = true;
    };
  }, [member, subtotal]);

  /**
   * Credit the order's points and fold the new balance into the local store so
   * the navbar and loyalty card update without a refetch. Guests are a no-op,
   * and any failure is swallowed — the order is already placed, and the points
   * can still be reconciled server-side.
   */
  const awardLoyaltyPoints = async (orderId: string) => {
    if (!member) return;
    try {
      const result = await awardOrderPoints(orderId);
      if (result.awarded && result.totalPoints != null && result.tier) {
        setMember({ ...member, points: result.totalPoints, tier: result.tier });
      }
    } catch (loyaltyError) {
      console.error('[loyalty] Could not award points for order', orderId, loyaltyError);
    }
  };

  const handleContinue = async () => {
    const contactOk = contactRef.current?.validate() ?? false;
    const addressOk = addressRef.current?.validate() ?? false;
    if (!contactOk || !addressOk) {
      document.querySelector('.border-red-400')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const contactData = contactRef.current?.getData();
    const addressData = addressRef.current?.getData();
    const deliveryAddress = orderType === 'delivery'
      ? `${addressData?.street}, ${addressData?.city}${addressData?.postal ? ', ' + addressData.postal : ''}${addressData?.instructions ? '. ' + addressData.instructions : ''}`
      : undefined;
    const orderPayload = {
      customer: {
        name:  contactData?.name,
        phone: contactData?.phone,
        email: contactData?.email,
      },
      type: orderType,
      deliveryAddress,
      items: items.map((i) => ({
        menuItem: i.id,
        qty: i.quantity,
      })),
      note,
      paymentMethod: payMethod,
    };

    setPlacing(true);
    try {
      if (payMethod !== 'cod') {
        const res = await fetch('/api/payhere/hash', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to start PayHere checkout');
        }
        if (!window.payhere?.startPayment) {
          throw new Error('PayHere checkout is still loading. Please try again.');
        }

        window.payhere.onCompleted = () => {
          clearCart();
          router.push(`/tracker/${data.order._id}`);
        };
        window.payhere.onDismissed = () => {
          setPlacing(false);
        };
        window.payhere.onError = (error) => {
          console.error('[PayHere]', error);
          alert('Payment could not be completed. Please try again.');
          setPlacing(false);
        };

        window.payhere.startPayment(data.payment);
        return;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const order = await res.json();
      if (!res.ok) throw new Error(order?.message || 'Failed to place order');

      // Cash orders earn loyalty points right away. Card/wallet orders are
      // credited server-side by the PayHere webhook once payment confirms.
      // A no-op for guests, and never allowed to block the confirmation.
      await awardLoyaltyPoints(order._id);

      clearCart();
      router.push(`/tracker/${order._id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      {/* <Script
        src="https://www.payhere.lk/lib/payhere.js"
        strategy="afterInteractive"
      /> */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <section className="space-y-5">
            <CheckoutHeader
              backHref="/menu"
              title="Checkout"
              subtitle="Complete your order details below"
              badge="Secure"
            />
            <ContactForm ref={contactRef} />
            <DeliveryAddressForm ref={addressRef} />

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-2.5">
                {([
                  { id: 'cod'    as const, label: 'Cash on Delivery', desc: 'Pay when your order arrives'        },
                  { id: 'card'   as const, label: 'Credit / Debit Card', desc: 'Pay securely with PayHere'       },
                  { id: 'wallet' as const, label: 'Digital Wallet', desc: 'PayHere wallets and online banking'   },
                ]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all
                      ${payMethod === m.id ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all
                      ${payMethod === m.id ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                      {payMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${payMethod === m.id ? 'text-red-700' : 'text-gray-800'}`}>{m.label}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <AdditionalNotes />
          </section>

          {/* Order Summary */}
          <aside>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>

              {items.length > 0 ? (
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-700">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-gray-400 mb-4">
                  <ShoppingBag className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-sm">No items in basket</p>
                </div>
              )}

              <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-700">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{orderType === 'pickup' ? 'Pickup (no fee)' : 'Delivery Fee'}</span>
                  <span className="font-medium text-gray-700">
                    {deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-base py-4 border-t border-gray-100 mt-2">
                <span>Total</span>
                <span className="text-red-600">Rs. {total.toLocaleString()}</span>
              </div>

              {pointsPreview && pointsPreview.points > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5 mb-4 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-amber-800">
                    You&apos;ll earn <span className="font-bold">{pointsPreview.points} pts</span> on this order
                    {pointsPreview.birthdayBonus && ' — 3× birthday bonus 🎂'}
                  </span>
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={placing || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm
                           hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm hover:shadow-md
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {payMethod === 'cod' ? 'Placing Order…' : 'Opening PayHere…'}</>
                ) : (
                  <>{payMethod === 'cod' ? 'Place Order' : 'Pay with PayHere'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure checkout
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
