import express from "express";
import { testOrderController } from "../controllers/order.controller";

const router = express.Router();

// 🔹 Test route
router.get("/", testOrderController);

// 🔹 Optional example route
router.get("/profile", testOrderController);

export default router;