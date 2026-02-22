import express from "express";
import { createDiscountCodes, createProduct, deleteDiscountCode, deleteProduct, getAllProducts, getCategory, getDiscountCodes, getFeaturedProducts, getFilteredOffers, getFilteredProducts, getFilteredShops, getHomepageFeed, getNewArrivals, getProductDetails, getProductsByShopSlug, getShopProducts, getTopShops, getTrendingProducts, restoreProduct, searchProducts } from "../controllers/product.controller";
import isSellerAuthenticated from "../../../../packages/middleware/isSellerAuthenticated";


const router = express.Router();

router.get("/get-all-products", getAllProducts);
router.get("/get-discount-code", isSellerAuthenticated, getDiscountCodes);
router.get("/get-category", getCategory);
router.post("/create-discount-code", isSellerAuthenticated, createDiscountCodes);
router.get("/get-discount-code", isSellerAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isSellerAuthenticated, deleteDiscountCode);
router.post("/create-product", isSellerAuthenticated, createProduct);
router.get("/get-shop-product", isSellerAuthenticated, getShopProducts);  
router.delete("/delete-product/:id", isSellerAuthenticated, deleteProduct);
router.put("/restore-product/:id", isSellerAuthenticated, restoreProduct);
router.get("/get-product/:slug", getProductDetails);
router.get("/get-filtered-products", getFilteredProducts); 
router.get("/get-filtered-offers", getFilteredOffers); 
router.get("/get-filtered-shops", getFilteredShops);
router.get("/search-products", searchProducts); 
router.get("/top-shops", getTopShops);
router.get("/shops/:slug", getProductsByShopSlug);

router.get("/featured-products", getFeaturedProducts);
router.get("/trending-products", getTrendingProducts);
router.get("/new-arrivals", getNewArrivals);

router.get("/homepage-feed", getHomepageFeed);



export default router;