import { Router } from "express";
import { protect } from "../middleware/protectRoute";
import { addToCart, clearCart, getMyCart, removeCartItem, updateCartItem } from "../controllers/cartControllers";

const router = Router();

// All cart routes are protected
router.use(protect);

// GET current user's cart
router.get("/", getMyCart);

// Add item to cart
router.post("/add", addToCart);

// Update item quantity
router.patch("/item/:productId", updateCartItem);

// Remove item
router.delete("/item/:productId", removeCartItem);

// Clear cart
router.delete("/", clearCart);

export default router;


