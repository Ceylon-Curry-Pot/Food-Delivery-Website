import { create } from 'zustand';
import { getDeliveryFee } from '@/lib/delivery';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type OrderType = 'delivery' | 'pickup';

export type CartStore = {
  items: CartItem[];
  note: string;
  orderType: OrderType;

  // Selected delivery area
  deliveryArea: string;

  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;

  setNote: (note: string) => void;
  setOrderType: (type: OrderType) => void;
  setDeliveryArea: (area: string) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  note: '',
  orderType: 'delivery',

  // No delivery area selected initially
  deliveryArea: '',

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((x) => x.id === item.id);

      if (existing) {
        return {
          items: state.items.map((x) =>
            x.id === item.id
              ? { ...x, quantity: x.quantity + 1 }
              : x
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity: 1,
          },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((x) => x.id !== id),
    })),

  increaseQty: (id) =>
    set((state) => ({
      items: state.items.map((x) =>
        x.id === id
          ? {
              ...x,
              quantity: x.quantity + 1,
            }
          : x
      ),
    })),

  decreaseQty: (id) =>
    set((state) => ({
      items: state.items
        .map((x) =>
          x.id === id
            ? {
                ...x,
                quantity: x.quantity - 1,
              }
            : x
        )
        .filter((x) => x.quantity > 0),
    })),

  setNote: (note) =>
    set({
      note,
    }),

  setOrderType: (type) =>
    set({
      orderType: type,

      // Clear delivery area when switching to pickup
      ...(type === 'pickup'
        ? {
            deliveryArea: '',
          }
        : {}),
    }),

  setDeliveryArea: (area) =>
    set({
      deliveryArea: area,
    }),

  clearCart: () =>
    set({
      items: [],
      note: '',
      orderType: 'delivery',
      deliveryArea: '',
    }),
}));

// ─────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────

export const selectSubtotal = (s: CartStore) =>
  s.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

/**
 * Returns:
 * number → known delivery fee
 * 0      → pickup
 * null   → delivery selected but no area selected
 */
export const selectDeliveryFee = (
  s: CartStore
): number | null => {
  if (s.orderType === 'pickup') {
    return 0;
  }

  if (!s.deliveryArea) {
    return null;
  }

  return getDeliveryFee(s.deliveryArea);
};

export const selectTotal = (s: CartStore) =>
  selectSubtotal(s) + (selectDeliveryFee(s) ?? 0);

export const selectTotalItems = (s: CartStore) =>
  s.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );