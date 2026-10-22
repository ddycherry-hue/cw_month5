import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(persist(
  (set) => ({
    favorites: [],
    toggleFavorite: (product) => set((state) => {
      const exists = state.favorites.some((item) => item.id === product.id);
      return { favorites: exists
        ? state.favorites.filter((item) => item.id !== product.id)
        : [...state.favorites, product] };
    }),
  }),
  { name: "escuelajs-favorites" },
));
