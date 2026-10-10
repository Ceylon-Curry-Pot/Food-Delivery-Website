'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useCartStore } from '@/components/global/useCartStore';
import { findDeliveryArea, deliveryAreas, formatDeliveryFee } from '@/lib/delivery';

export type DeliveryAddressFormHandle = {
  validate: () => boolean;
  getData: () => { street: string; area: string; postal: string; instructions: string }; // city → area
};

const DeliveryAddressForm = forwardRef<DeliveryAddressFormHandle>((_, ref) => {
  const orderType       = useCartStore((s) => s.orderType);
  const deliveryArea    = useCartStore((s) => s.deliveryArea);
  const setDeliveryArea = useCartStore((s) => s.setDeliveryArea);

  const streetRef      = useRef<HTMLInputElement>(null);
  const postalRef      = useRef<HTMLInputElement>(null);
  const instructionRef = useRef<HTMLInputElement>(null);

  const [areaError, setAreaError] = useState(false);
  const match = findDeliveryArea(deliveryArea);

  useImperativeHandle(ref, () => ({
    validate() {
      if (orderType === 'pickup') return true;
      let ok = true;
      if (!streetRef.current?.value.trim()) {
        streetRef.current?.classList.add('border-red-400', 'bg-red-50');
        ok = false;
      }
      if (!match) {
        setAreaError(true);
        ok = false;
      }
      return ok;
    },
    getData() {
      return {
        street:       streetRef.current?.value.trim()      ?? '',
        area:         match?.area ?? '', // canonical spelling from our list, not raw typing
        postal:       postalRef.current?.value.trim()      ?? '',
        instructions: instructionRef.current?.value.trim() ?? '',
      };
    },
  }));

  const clearError = (el: HTMLInputElement) =>
    el.classList.remove('border-red-400', 'bg-red-50');

  if (orderType === 'pickup') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
            <MapPin className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Pickup Location</h2>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
          <p className="font-semibold text-gray-800">Ceylon Curry Pot</p>
          <p>Liberty Plaza I Food Court, Colombo</p>
          <p className="text-gray-400 text-xs pt-1">
            Ready for pickup in approximately 25–30 minutes after confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <MapPin className="w-4 h-4 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            ref={streetRef}
            type="text"
            placeholder="123 Main Street, Apt 4B"
            onChange={(e) => clearError(e.target)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                      outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>

        {/* Delivery area: type-ahead + dropdown, replaces the old City input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Delivery Area <span className="text-red-500">*</span>
          </label>
          <input
            list="delivery-areas"
            value={deliveryArea}
            onChange={(e) => {
              setDeliveryArea(e.target.value);
              setAreaError(false);
            }}
            placeholder="Start typing, e.g. Nugegoda"
            autoComplete="off"
            className={`border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                        outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all
                        ${areaError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          <datalist id="delivery-areas">
            {deliveryAreas.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>

          {match ? (
            <p className="text-xs text-emerald-600">
              ✓ Delivery available · {formatDeliveryFee(match.zone.fee)}
            </p>
          ) : deliveryArea.trim() ? (
            <p className="text-xs text-red-500">
              We don&apos;t deliver there yet. Please pick an area from the list.
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Postal Code
          </label>
          <input
            ref={postalRef}
            type="text"
            placeholder="00300"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Delivery Instructions
          </label>
          <input
            ref={instructionRef}
            type="text"
            placeholder="Gate code, landmark, floor number…"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                      outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>
      </div>
    </div>
  );
});

DeliveryAddressForm.displayName = 'DeliveryAddressForm';
export default DeliveryAddressForm;