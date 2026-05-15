'use client';

import { OrderStatus } from '@/lib/models/Order';
import { CheckCircle2, Clock, ChefHat, Bike, PartyPopper, XCircle } from 'lucide-react';

const STEPS: {
  key: OrderStatus;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  eta: string;
}[] = [
  { key: 'pending',          label: 'Order Received',   shortLabel: 'Received',  icon: Clock,         eta: 'Just now'        },
  { key: 'confirmed',        label: 'Order Confirmed',  shortLabel: 'Confirmed', icon: CheckCircle2,  eta: '~2 min'          },
  { key: 'preparing',        label: 'Being Prepared',   shortLabel: 'Preparing', icon: ChefHat,       eta: '~20 min'         },
  { key: 'out_for_delivery', label: 'Out for Delivery', shortLabel: 'On the way',icon: Bike,          eta: '~15 min'         },
  { key: 'delivered',        label: 'Delivered!',       shortLabel: 'Delivered', icon: PartyPopper,   eta: 'Enjoy your meal' },
];

type Props = { status: OrderStatus };

export default function OrderStatusTracker({ status }: Props) {
  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="font-bold text-gray-800 text-lg">Order Cancelled</p>
        <p className="text-sm text-gray-400">This order has been cancelled. Please contact us if you have questions.</p>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="w-full">
      {/* ── Desktop: horizontal ── */}
      <div className="hidden sm:flex items-start justify-between relative">
        {/* Background connector line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        {/* Active connector line — grows based on progress */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-red-500 z-0 transition-all duration-700"
          style={{ width: currentIndex === 0 ? '0%' : `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, i) => {
          const Icon       = step.icon;
          const isComplete = i < currentIndex;
          const isActive   = i === currentIndex;
          const isFuture   = i > currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isComplete ? 'bg-red-600 border-red-600 text-white'        : ''}
                  ${isActive   ? 'bg-white border-red-600 text-red-600 shadow-lg shadow-red-100 scale-110' : ''}
                  ${isFuture   ? 'bg-white border-gray-200 text-gray-300'      : ''}
                `}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Label */}
              <p
                className={`mt-2.5 text-xs font-semibold text-center leading-tight max-w-[80px]
                  ${isComplete ? 'text-red-600' : ''}
                  ${isActive   ? 'text-gray-900' : ''}
                  ${isFuture   ? 'text-gray-400' : ''}
                `}
              >
                {step.label}
              </p>

              {/* ETA — only for active */}
              {isActive && (
                <span className="mt-1 text-[10px] text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                  {step.eta}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Mobile: vertical ── */}
      <div className="sm:hidden flex flex-col gap-0">
        {STEPS.map((step, i) => {
          const Icon       = step.icon;
          const isComplete = i < currentIndex;
          const isActive   = i === currentIndex;
          const isFuture   = i > currentIndex;
          const isLast     = i === STEPS.length - 1;

          return (
            <div key={step.key} className="flex gap-4">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-500
                    ${isComplete ? 'bg-red-600 border-red-600 text-white'    : ''}
                    ${isActive   ? 'bg-white border-red-600 text-red-600 shadow-md' : ''}
                    ${isFuture   ? 'bg-white border-gray-200 text-gray-300'  : ''}
                  `}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[24px] mt-1 mb-1 transition-colors duration-500 ${isComplete ? 'bg-red-400' : 'bg-gray-200'}`} />
                )}
              </div>

              {/* Content column */}
              <div className={`pb-5 ${isLast ? 'pb-0' : ''} pt-1`}>
                <p className={`font-semibold text-sm ${isComplete ? 'text-red-600' : isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {isActive && (
                  <span className="inline-block mt-1 text-[11px] text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                    {step.eta}
                  </span>
                )}
                {isComplete && (
                  <p className="text-xs text-gray-400 mt-0.5">Completed</p>
                )}
                {isFuture && (
                  <p className="text-xs text-gray-400 mt-0.5">Upcoming</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}