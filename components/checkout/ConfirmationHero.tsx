'use client';

import { CheckCircle2 } from 'lucide-react';

export default function ConfirmationHero() {
  const orderId = '#CCP-' + Math.floor(10000 + Math.random() * 90000);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Thank you for choosing Ceylon Curry Pot. Your authentic Sri Lankan meal is being lovingly prepared.
      </p>

      <div className="inline-flex flex-col items-center bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Your Order ID</p>
        <p className="text-2xl font-bold text-red-600">{orderId}</p>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        A confirmation SMS has been sent to your phone number
      </p>
    </div>
  );
}