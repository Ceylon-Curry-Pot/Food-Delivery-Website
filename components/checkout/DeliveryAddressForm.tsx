'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useCartStore } from '@/components/global/useCartStore';

export type DeliveryAddressFormHandle = {
  validate: () => boolean;
  getData: () => { street: string; city: string; postal: string; instructions: string };
};

const DeliveryAddressForm = forwardRef<DeliveryAddressFormHandle>((_, ref) => {
  const orderType      = useCartStore((s) => s.orderType);
  const streetRef      = useRef<HTMLInputElement>(null);
  const cityRef        = useRef<HTMLInputElement>(null);
  const postalRef      = useRef<HTMLInputElement>(null);
  const instructionRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    validate() {
      if (orderType === 'pickup') return true;
      let ok = true;
      [streetRef, cityRef].forEach((r) => {
        if (!r.current?.value.trim()) {
          r.current?.classList.add('border-red-400', 'bg-red-50');
          ok = false;
        }
      });
      return ok;
    },
    getData() {
      return {
        street:       streetRef.current?.value.trim()      ?? '',
        city:         cityRef.current?.value.trim()         ?? '',
        postal:       postalRef.current?.value.trim()       ?? '',
        instructions: instructionRef.current?.value.trim()  ?? '',
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
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-1">Ceylon Curry Pot</p>
          <p>123 Galle Road, Colombo 03</p>
          <p className="text-gray-400 mt-1 text-xs">Ready for pickup in approx. 25–30 minutes</p>
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            City <span className="text-red-500">*</span>
          </label>
          <input
            ref={cityRef}
            type="text"
            placeholder="Colombo"
            onChange={(e) => clearError(e.target)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
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