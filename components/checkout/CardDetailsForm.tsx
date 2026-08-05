'use client';

import { Lock } from 'lucide-react';

export default function CardDetailsForm() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <Lock className="w-4 h-4 text-red-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Card Details</h2>
          <p className="text-xs text-gray-400">256-bit SSL encrypted</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Card Number
          </label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all font-mono tracking-widest"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Expiry Date
          </label>
          <input
            type="text"
            placeholder="MM / YY"
            maxLength={7}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CVV</label>
          <input
            type="password"
            placeholder="•••"
            maxLength={4}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Name on Card
          </label>
          <input
            type="text"
            placeholder="AMAL PERERA"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
                       outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all uppercase"
          />
        </div>
      </div>
    </div>
  );
}