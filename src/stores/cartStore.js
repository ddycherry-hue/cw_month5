import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(persist((set) => ({
  items: [],
  addToCart: (product) => set((state) => {
    const found = state.items.find((item) => item.id === product.id);
    return { items: found
      ? state.items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...state.items, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}), { name: "escuelajs-cart" }));
