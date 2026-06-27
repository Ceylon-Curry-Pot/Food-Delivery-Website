'use client';

import { OrderStatus } from '@/lib/models/Order';
import {
  CheckCircle2, Clock, ChefHat,
  Bike, PartyPopper, XCircle,
  ShoppingBag, PackageCheck,
} from 'lucide-react';

type Step = {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
  eta: string;
};

const DELIVERY_STEPS: Step[] = [
  { key: 'pending',          label: 'Order Received',   icon: Clock,        eta: 'Just now'        },
  { key: 'confirmed',        label: 'Order Confirmed',  icon: CheckCircle2, eta: '~2 min'          },
  { key: 'preparing',        label: 'Being Prepared',   icon: ChefHat,      eta: '~20 min'         },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike,         eta: '~15 min'         },
  { key: 'delivered',        label: 'Delivered!',       icon: PartyPopper,  eta: 'Enjoy your meal' },
];

const PICKUP_STEPS: Step[] = [
  { key: 'pending',          label: 'Order Received',   icon: Clock,        eta: 'Just now'        },
  { key: 'confirmed',        label: 'Order Confirmed',  icon: CheckCircle2, eta: '~2 min'          },
  { key: 'preparing',        label: 'Being Prepared',   icon: ChefHat,      eta: '~20 min'         },
  { key: 'out_for_delivery', label: 'Ready for Pickup', icon: ShoppingBag,  eta: 'Head over now'   },
  { key: 'delivered',        label: 'Picked Up!',       icon: PackageCheck, eta: 'Enjoy your meal' },
];

type Props = {
  status: OrderStatus;
  orderType?: 'delivery' | 'pickup';
};

export default function OrderStatusTracker({ status, orderType = 'delivery' }: Props) {
  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
          <XCircle className="w-7 h-7 text-red-500" />
        </div>
        <p className="font-heading font-bold text-gray-900 text-lg">Order Cancelled</p>
        <p className="text-sm text-gray-400 max-w-xs">
          This order has been cancelled. Please contact us if you have questions.
        </p>
      </div>
    );
  }

  const STEPS = orderType === 'pickup' ? PICKUP_STEPS : DELIVERY_STEPS;
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="w-full">

      {/* ── Desktop: horizontal ── */}
      <div className="hidden sm:block">
        <div className="relative flex justify-between items-start">
          {/* Track background */}
          <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-gray-100" />
          {/* Track fill */}
          <div
            className="absolute top-5 left-[5%] h-0.5 bg-red-600 transition-all duration-700"
            style={{
              width: currentIndex <= 0
                ? '0%'
                : `${(currentIndex / (STEPS.length - 1)) * 90}%`,
            }}
          />

          {STEPS.map((step, i) => {
            const Icon       = step.icon;
            const isComplete = i < currentIndex;
            const isActive   = i === currentIndex;
            const isFuture   = i > currentIndex;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${isComplete ? 'bg-red-600 border-red-600 text-white'                              : ''}
                    ${isActive   ? 'bg-white border-red-600 text-red-600 shadow-lg ring-4 ring-red-100 scale-110' : ''}
                    ${isFuture   ? 'bg-white border-gray-200 text-gray-300'                            : ''}
                  `}
                >
                  {isComplete
                    ? <CheckCircle2 className="w-5 h-5" />
                    : <Icon className="w-4 h-4" />
                  }
                </div>

                <p
                  className={`mt-3 text-xs font-semibold text-center max-w-[80px] leading-tight
                    ${isComplete ? 'text-red-600'  : ''}
                    ${isActive   ? 'text-gray-900' : ''}
                    ${isFuture   ? 'text-gray-400' : ''}
                  `}
                >
                  {step.label}
                </p>

                {isActive && (
                  <span className="mt-1.5 text-[10px] font-medium text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {step.eta}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: vertical ── */}
      <div className="sm:hidden">
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
                    ${isComplete ? 'bg-red-600 border-red-600 text-white'               : ''}
                    ${isActive   ? 'bg-white border-red-600 text-red-600 ring-4 ring-red-50' : ''}
                    ${isFuture   ? 'bg-white border-gray-200 text-gray-300'             : ''}
                  `}
                >
                  {isComplete
                    ? <CheckCircle2 className="w-4 h-4" />
                    : <Icon className="w-4 h-4" />
                  }
                </div>
                {!isLast && (
                  <div
                    className={`w-px flex-1 min-h-[28px] my-1 transition-colors duration-500
                      ${isComplete ? 'bg-red-300' : 'bg-gray-100'}
                    `}
                  />
                )}
              </div>

              {/* Content column */}
              <div className={`pt-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                <p
                  className={`font-semibold text-sm
                    ${isComplete ? 'text-red-600'  : ''}
                    ${isActive   ? 'text-gray-900' : ''}
                    ${isFuture   ? 'text-gray-400' : ''}
                  `}
                >
                  {step.label}
                </p>
                {isActive && (
                  <span className="inline-block mt-1 text-[11px] text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-medium">
                    {step.eta}
                  </span>
                )}
                {isComplete && (
                  <p className="text-xs text-gray-400 mt-0.5">Completed</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}