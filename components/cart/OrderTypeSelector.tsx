import { Bike, Store } from 'lucide-react';
import { OrderType } from './cart.types';

type Props = {
  value: OrderType;
  onChange: (type: OrderType) => void;
};

export default function OrderTypeSelector({ value, onChange }: Props) {
  const options = [
    {
      key: 'delivery' as const,
      label: 'Delivery',
      icon: Bike,
    },
    {
      key: 'pickup' as const,
      label: 'Pick-Up',
      icon: Store,
    },
  ];

   return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.key;

        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            className={`rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 transition-all
              ${
                active
                  ? 'bg-red-600 text-white border-red-600 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
              }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${active ? 'bg-white/20' : 'bg-red-50'}`}>
              <Icon className="w-7 h-7" />
            </div>
            <span className="font-semibold">{option.label}</span>
          </button>
        );
      })}
    </div>
    );
}