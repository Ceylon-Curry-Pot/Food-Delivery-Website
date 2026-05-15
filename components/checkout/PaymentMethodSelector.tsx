'use client';

import { useState } from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaymentMethod = 'cod' | 'card' | 'wallet';

const methods = [
  {
    id: 'cod' as const,
    label: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
  {
    id: 'card' as const,
    label: 'Credit / Debit Card',
    description: 'Visa, Mastercard, AMEX',
    icon: CreditCard,
  },
  {
    id: 'wallet' as const,
    label: 'Digital Wallet',
    description: 'FriMi, eZ Cash, Sampath Vishwa',
    icon: Smartphone,
  },
];

export default function PaymentMethodSelector() {
  const [selected, setSelected] = useState<PaymentMethod>('cod');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const active = selected === method.id;
          return (
            <button
              key={method.id}
              onClick={() => setSelected(method.id)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all',
                active
                  ? 'border-red-400 bg-red-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  active ? 'border-red-600 bg-red-600' : 'border-gray-300'
                )}
              >
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              <div className="flex-1">
                <p className={cn('font-semibold text-sm', active ? 'text-red-700' : 'text-gray-800')}>
                  {method.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
              </div>

              <Icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-red-500' : 'text-gray-300')} />
            </button>
          );
        })}
      </div>
    </div>
  );
}