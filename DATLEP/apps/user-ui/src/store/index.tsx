import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { sendKafkaEvent } from "../actions/track-user";

type Product = {
  _id: string;
  title: string;
  image: string;
  price: number;
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
  deliveryTime?: string;
  quantity: number;
};

type Store = {
  cart: Product[];
  wishlist: Product[];

  addToCart: (product: Product, user: any, location: any, deviceInfo: string) => void;

  removeFromCart: (
    product: Product,
    id: string,
    user: any,
    location: any,
    deviceInfo: string
  ) => void;

  addToWishlist: (product: Product, user: any, location: any, deviceInfo: string) => void;

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
  // 1️⃣ Update cart state
  set((state) => {
    const existing = state.cart.find((item) => item._id === product._id);

    if (existing) {
      return {
        cart: state.cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        ),
      };
    }

    return { cart: [...state.cart, { ...product, quantity: 1 }] };
  });

  // 2️⃣ Prepare analytics data
  const userId = user?.id ?? user?._id;

  // 3️⃣ Validate required fields
  if (!userId || !location?.country || !location?.city || !deviceInfo) {
    console.warn("[STORE] addToCart - blocked ❌ missing fields", {
      userId,
      country: location?.country,
      city: location?.city,
      deviceInfo,
    });
    return;
  }

  // 4️⃣ Send Kafka event
  console.log("[STORE] addToCart - sending event ✅", {
    userId,
    productId: product._id,
    shopId: product.shopId,
    deviceInfo,
    location,
  });

  sendKafkaEvent({
    userId,
    action: "add_to_cart",
    productId: product._id,
    shopId: product.shopId,
    device: deviceInfo,
    country: location.country,
    city: location.city,
  });
},

        removeFromCart: (_product, id, user, location, deviceInfo) => {
          const item = get().cart.find((p) => p._id === id);

          set((state) => ({
            cart: state.cart.filter((p) => p._id !== id),
          }));

          if (user?.id && location?.country && location?.city && deviceInfo && item) {
            sendKafkaEvent({
              userId: user.id,
              action: "remove_from_cart",
              productId: id,          // ✅ use id
              shopId: item.shopId,    // ✅ use actual cart item
              device: deviceInfo,
              country: location.country,
              city: location.city,
            });
          }
        },

        addToWishlist: (product, user, location, deviceInfo) => {
          set((state) => {
            const exists = state.wishlist.some((item) => item._id === product._id);
            if (exists) return state;
            return { wishlist: [...state.wishlist, product] };
          });

          if (user?.id && location?.country && location?.city && deviceInfo) {
            sendKafkaEvent({
              userId: user.id,
              action: "add_to_wishlist",
              productId: product._id,
              shopId: product.shopId,
              device: deviceInfo,
              country: location.country,
              city: location.city,
            });
          }
        },

        removeFromWishlist: (_product, id, user, location, deviceInfo) => {
          const item = get().wishlist.find((p) => p._id === id);

          set((state) => ({
            wishlist: state.wishlist.filter((p) => p._id !== id),
          }));

          if (user?.id && location?.country && location?.city && deviceInfo && item) {
            sendKafkaEvent({
              userId: user.id,
              action: "remove_from_wishlist",
              productId: id,        // ✅ use id
              shopId: item.shopId,  // ✅ use actual wishlist item
              device: deviceInfo,
              country: location.country,
              city: location.city,
            });
          }
        },

        clearCart: () => set({ cart: [] }),
        clearWishlist: () => set({ wishlist: [] }),
      }),
      { name: "store-storage" }
    )
  )
);
