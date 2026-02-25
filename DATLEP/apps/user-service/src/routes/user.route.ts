import express from "express";
import { testUserController } from "../controllers/user.controller";

const router = express.Router();

// 🔹 Test route
router.get("/", testUserController);

// 🔹 Optional example route
router.get("/profile", testUserController);

export default router;