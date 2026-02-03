import { ProductAnalytics, UserAnalytics } from "@datlep/database";

export const updateUserAnalytics = async(event: any) => {
    try {
    const exitingUser = await UserAnalytics.findOne({ user: event.userId });

let updatedActions = exitingUser?.actions ?? [];


     const actionExists = updatedActions.some((entry: any) => entry.productId === event.productId && entry.action === event.action);

     // Aways store `product_view` for recommendations
     if (event.action === 'product_view') {
        updatedActions.push({ productId: event.productId,
            shopId: event.shopId,
        action: "product_view",
        timestamp: new Date() });
     }
     
     else if(["add_to_cart","add_to_wishlist"].includes(event.action) && !actionExists) {
       updatedActions.push({ productId: event.productId,
        shopId: event.shopId,
        action: event.action,
        timestamp: new Date() });  
     }

     // Remove "add_to_cart" action if "remove_from_cart" is triggered

     else if(event.action === "remove_from_cart") {
        updatedActions = updatedActions.filter((entry: any) => !(entry.productId === event.productId && entry.action === "add_to_cart")
    );
         
     }

     // Remove "add_to_wishlist" action if "remove_from_wishlist" is triggered

     else if(event.action === "remove_from_wishlist") {
         updatedActions = updatedActions.filter((entry: any) => !(entry.productId === event.productId && entry.action === "add_to_wishlist")
    );
     }

     // keep only the last 100 actions (prevent db from getting too big)
     if(updatedActions.length > 100) {
        updatedActions.shift();
     }
     const extraFields:Record<string, any> = {};

     if(event.country) {
        extraFields.country = event.country;
     }

     if(event.city) {
        extraFields.city = event.city;
     }

     if(event.device) {
        extraFields.device = event.device;
     }
     // Update or create user analytics
     await UserAnalytics.updateOne({userId: event.userId,
        lastVistedAt: new Date(),
     }, {$set: {actions: updatedActions, ...extraFields}}, {upsert: true});

     //Also update product analytics

    } catch (error) {
      console.log(`Error updating user analytics: ${error}`);  
    }
}

export const updateProductAnalytics = async (event: any) => {
  try {
    if (!event.productId) return;

    const incFields: Record<string, number> = {};
    const setFields: Record<string, any> = {};
    const pushFields: any = {
      action: event.action,
      timestamp: new Date(),
    };

    // Increment counters
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
      { product: event.productId },
      {
        $inc: incFields,
        $set: setFields,
        $push: {
          actions: pushFields,
        },
        $setOnInsert: {
          product: event.productId,
          shop: event.shopId,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Error updating product analytics:`, error);
  }
};