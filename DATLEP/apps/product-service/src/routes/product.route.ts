import express from "express";
import { createDiscountCodes, deleteDiscountCode, getCategory, getDiscountCodes } from "../controllers/product.controller";
import isSellerAuthenticated from "../../../../packages/middleware/isSellerAuthenticated";


const router = express.Router();

router.get("/get-discount-code", isSellerAuthenticated, getDiscountCodes);
router.get("/get-category", getCategory);
router.post("/create-discount-code", isSellerAuthenticated, createDiscountCodes);
router.get("/get-discount-code", isSellerAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id", isSellerAuthenticated, deleteDiscountCode);


export default router;