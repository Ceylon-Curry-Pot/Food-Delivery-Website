import { Trash2, Minus, Plus } from "lucide-react";
import { CartItem } from "./cart.types";

type Props = {
    item: CartItem;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
};

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }: Props) {
    return (
        <div className="flex gap-4 rounded-2xl border border-gray-100 p-4 bg-white">
            <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-red-600 font-semibold mt-1">
                            Rs. {item.price.toLocaleString()}
                        </p>
                    </div>

                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                 <div className="mt-4 flex items-center gap-3">
                    <button
                        onClick={() => onDecrease(item.id)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    <span className="font-semibold min-w-[24px] text-center">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() => onIncrease(item.id)}
                        className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
  );
}