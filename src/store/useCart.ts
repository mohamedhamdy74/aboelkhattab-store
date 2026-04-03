import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // variantId-productId
  productId: string;
  variantId: string;
  nameAr: string;
  nameEn: string;
  sizeAr: string;
  sizeEn: string;
  image: string;
  price: number;
  quantity: number;
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, delta) => {
        const items = get().items;
        set({
          items: items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: "alkhattab-cart",
    }
  )
);
