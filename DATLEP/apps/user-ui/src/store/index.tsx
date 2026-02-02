import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Product = {
  _id: string;
  title: string;
  image: string;
  price: number;
  quantity?: number;
  shopId: string;
  category?: string;
  shop?: {
    name: string;
    logo: string;
    isVerified: boolean;
    rating: number;
    isOnline?: boolean;
    responseTime?: string;
  };
  rating?: number;
  isFreeShipping?: boolean;
  isInStock?: boolean;
  discount?: number;
  originalPrice?: number;
  deliveryCost?: number;
  maxQuantity?: number;
  
};

type Store = {
  cart: Product[];
  wishlist: Product[];

  addToCart: (
    product: Product,
    user: any,
    location: any,
    deviceInfo: string 
  ) => void;

  removeFromCart: (
    product: Product,
    id: string,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;

  addToWishlist: (
    product: Product,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;

  removeFromWishlist: (
    product: Product,
    id: string,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;

  clearCart: () => void;
  clearWishlist: () => void;
};

export const useStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        wishlist: [],

        addToCart: (product, user, location, deviceInfo) => {
          set((state) => {
            const existing = state.cart.find(
              (item) => item._id === product._id
            );

            if (existing) {
              return {
                cart: state.cart.map((item) =>
                  item._id === product._id
                    ? { ...item, quantity: (item.quantity ?? 1) + 1 }
                    : item
                ),
              };
            }

            return {
              cart: [...state.cart, { ...product, quantity: 1 }],
            };
          });
        },

        removeFromCart: (product, id, user, location, deviceInfo) => {
            //find the item in the cart
            const removeFromCart = get().cart.find((item) => item._id === id);
          set((state) => ({
            cart: state.cart.filter((item) => item._id !== id),
          }));
        },

        addToWishlist: (product, user, location, deviceInfo) => {
          set((state) => {
            const exists = state.wishlist.some(
              (item) => item._id === product._id
            );

            if (exists) return state;

            return {
              wishlist: [...state.wishlist, product],
            };
          });
        },

        removeFromWishlist: (product, id, user, location, deviceInfo) => {
          set((state) => ({
            wishlist: state.wishlist.filter((item) => item._id !== id),
          }));
        },

        clearCart: () => set({ cart: [] }),

        clearWishlist: () => set({ wishlist: [] }),
      }),
      {
        name: "store-storage", // 🔑 required for persist
      }
    )
  )
);
