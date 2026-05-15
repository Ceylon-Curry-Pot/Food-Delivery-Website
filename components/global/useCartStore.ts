import { create } from 'zustand';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  note: string;
  orderType: 'delivery' | 'pickup';

  addItem:      (item: Omit<CartItem, 'quantity'>) => void;
  removeItem:   (id: string) => void;
  increaseQty:  (id: string) => void;
  decreaseQty:  (id: string) => void;
  setNote:      (note: string) => void;
  setOrderType: (type: 'delivery' | 'pickup') => void;
  clearCart:    () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items:     [],
  note:      '',
  orderType: 'delivery',

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((x) => x.id === item.id);
      if (existing) {
        return {
          items: state.items.map((x) =>
            x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((x) => x.id !== id) })),

  increaseQty: (id) =>
    set((state) => ({
      items: state.items.map((x) =>
        x.id === id ? { ...x, quantity: x.quantity + 1 } : x
      ),
    })),

  decreaseQty: (id) =>
    set((state) => ({
      items: state.items
        .map((x) => (x.id === id ? { ...x, quantity: x.quantity - 1 } : x))
        .filter((x) => x.quantity > 0),
    })),

  setNote:      (note) => set({ note }),
  setOrderType: (type) => set({ orderType: type }),
  clearCart:    ()     => set({ items: [], note: '' }),
}));

// ── Selectors ──
export const selectSubtotal    = (s: CartStore) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectDeliveryFee = (s: CartStore) => s.orderType === 'delivery' ? 300 : 0;
export const selectTotal       = (s: CartStore) => selectSubtotal(s) + selectDeliveryFee(s);
export const selectTotalItems  = (s: CartStore) => s.items.reduce((sum, i) => sum + i.quantity, 0);