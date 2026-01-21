import express from "express";
import { getCategory } from "../controllers/product.controller";


const router = express.Router();

router.get("/get-category", getCategory);

export default router;