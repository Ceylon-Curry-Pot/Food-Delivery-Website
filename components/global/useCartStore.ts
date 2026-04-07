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

  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  setNote: (note: string) => void;
  setOrderType: (type: 'delivery' | 'pickup') => void;

  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  note: '',
  orderType: 'delivery',

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
        items: [...state.items, { ...item, quantity: 1 }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((x) => x.id !== id),
    })),

  increaseQty: (id) =>
    set((state) => ({
      items: state.items.map((x) =>
        x.id === id ? { ...x, quantity: x.quantity + 1 } : x
      ),
    })),

  decreaseQty: (id) =>
    set((state) => ({
      items: state.items
        .map((x) =>
          x.id === id
            ? { ...x, quantity: x.quantity - 1 }
            : x
        )
        .filter((x) => x.quantity > 0),
    })),

  setNote: (note) => set({ note }),

  setOrderType: (type) => set({ orderType: type }),

  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  get subtotal() {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },

  get deliveryFee() {
    return get().orderType === 'delivery' ? 300 : 0;
  },

  get total() {
    return get().subtotal + get().deliveryFee;
  },
}));