'use client';

import Link from 'next/link';
import { Package, ChefHat, Bike, PartyPopper } from 'lucide-react';

const steps = [
  { icon: Package,      label: 'Order Received',    desc: 'Your order has been confirmed',          done: true  },
  { icon: ChefHat,      label: 'Preparing Your Meal', desc: 'Our chefs are cooking fresh for you',  done: false },
  { icon: Bike,         label: 'Out for Delivery',   desc: 'Estimated arrival: 35–45 minutes',       done: false },
  { icon: PartyPopper,  label: 'Delivered! Enjoy 🍛', desc: "Bon appétit!",                          done: false },
];

export default function ConfirmationDetails() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6">What happens next?</h2>

      <div className="space-y-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10
                    ${step.done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-gray-100 mt-1 mb-1 min-h-[24px]" />}
              </div>

              <div className={`${isLast ? 'pb-0' : 'pb-6'}`}>
                <p className={`font-semibold text-sm ${step.done ? 'text-green-700' : 'text-gray-700'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
        <Link
          href="/menu"
          className="block text-center bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm
                     hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Order Again
        </Link>
        <Link
          href="/home"
          className="block text-center text-gray-400 py-3 text-sm hover:text-gray-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}