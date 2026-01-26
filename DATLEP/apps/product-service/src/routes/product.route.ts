import express from "express";
import { createDiscountCodes, createProduct, deleteDiscountCode, deleteProduct, getCategory, getDiscountCodes, getShopProducts, restoreProduct } from "../controllers/product.controller";
import isSellerAuthenticated from "../../../../packages/middleware/isSellerAuthenticated";


const router = express.Router();

router.get("/get-discount-code", isSellerAuthenticated, getDiscountCodes);
router.get("/get-category", getCategory);
router.post("/create-discount-code", isSellerAuthenticated, createDiscountCodes);
router.get("/get-discount-code", isSellerAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isSellerAuthenticated, deleteDiscountCode);
router.post("/create-product", isSellerAuthenticated, createProduct);
router.get("/get-shop-product", isSellerAuthenticated, getShopProducts);  
router.delete("/delete-product/:id", isSellerAuthenticated, deleteProduct);
router.put("/restore-product/:id", isSellerAuthenticated, restoreProduct);


export default router;