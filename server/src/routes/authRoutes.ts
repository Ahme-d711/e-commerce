import express from "express";
import { login, logout, signup } from "../controllers/authController";
import { protect } from "../middleware/protectRoute";

const router = express.Router();

// Auth routes
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(protect, logout);

export default router;
