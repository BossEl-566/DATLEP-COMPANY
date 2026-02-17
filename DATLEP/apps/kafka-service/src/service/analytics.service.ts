import { ProductAnalytics, UserAnalytics } from "@datlep/database";
import { Types } from "mongoose";

const sameId = (a: any, b: any) => String(a) === String(b);

export const updateUserAnalytics = async (event: any) => {
  try {
    if (!event?.userId) return;

    const existingUser = await UserAnalytics.findOne({
      user: new Types.ObjectId(event.userId),
    });

    let updatedActions = existingUser?.actions ?? [];

    const actionExists = updatedActions.some(
      (entry: any) => sameId(entry.productId, event.productId) && entry.action === event.action
    );

    // Always store product_view for recommendations
    if (event.action === "product_view") {
      updatedActions.push({
        productId: new Types.ObjectId(event.productId),
        shopId: event.shopId ? new Types.ObjectId(event.shopId) : undefined,
        action: event.action,
        timestamp: new Date(),
      });
    } else if (
      ["add_to_cart", "add_to_wishlist"].includes(event.action) &&
      !actionExists
    ) {
      updatedActions.push({
        productId: new Types.ObjectId(event.productId),
        shopId: event.shopId ? new Types.ObjectId(event.shopId) : undefined,
        action: event.action,
        timestamp: new Date(),
      });
    } else if (event.action === "remove_from_cart") {
      updatedActions = updatedActions.filter(
        (entry: any) => !(sameId(entry.productId, event.productId) && entry.action === "add_to_cart")
      );
    } else if (event.action === "remove_from_wishlist") {
      updatedActions = updatedActions.filter(
        (entry: any) => !(sameId(entry.productId, event.productId) && entry.action === "add_to_wishlist")
      );
    }

    // keep only the last 100 actions
    if (updatedActions.length > 100) updatedActions.shift();

    const extraFields: Record<string, any> = {};
    if (event.country) extraFields.country = event.country;
    if (event.city) extraFields.city = event.city;
    if (event.device) extraFields.device = event.device;

    await UserAnalytics.updateOne(
      { user: new Types.ObjectId(event.userId) },
      {
        $set: {
          actions: updatedActions,
          ...extraFields,
          "engagement.lastActive": new Date(),
          lastVisitedAt: new Date(),
        },
        $setOnInsert: {
          user: new Types.ObjectId(event.userId),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.log(`Error updating user analytics: ${error}`);
  }
};

export const updateProductAnalytics = async (event: any) => {
  try {
    if (!event?.productId) return;

    const incFields: Record<string, number> = {};
    const setFields: Record<string, any> = {};

    if (event.action === "product_view") {
      incFields.views = 1;
      setFields.lastViewedAt = new Date();
    }
    if (event.action === "add_to_cart") incFields.addedToCart = 1;
    if (event.action === "remove_from_cart") incFields.removedFromCart = 1;
    if (event.action === "add_to_wishlist") incFields.addedToWishlist = 1;
    if (event.action === "remove_from_wishlist") incFields.removedFromWishlist = 1;
    if (event.action === "purchase") incFields.purchases = 1;

    await ProductAnalytics.updateOne(
      { product: new Types.ObjectId(event.productId) },
      {
        ...(Object.keys(incFields).length ? { $inc: incFields } : {}),
        ...(Object.keys(setFields).length ? { $set: setFields } : {}),
        $push: {
          actions: { action: event.action, timestamp: new Date() },
        },
        $setOnInsert: {
          product: new Types.ObjectId(event.productId),
          shop: event.shopId ? new Types.ObjectId(event.shopId) : undefined,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Error updating product analytics:`, error);
  }
};
