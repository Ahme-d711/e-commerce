import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductByID, updateProduct } from '../controllers/productController';
import { createProductSchema } from '../validators/productValidator';
import validateRequest from '../middleware/validateRequest';
import { protect } from '../middleware/protectRoute';
import { restrictedTo } from '../middleware/adminProtected';
import upload from '../middleware/melter';

const router = express.Router();

// GET + CREATE
router
.route("/")
.get(protect, getAllProducts)
.post(protect, upload.single("image"), validateRequest(createProductSchema), createProduct);

// GET by ID + UPDATE + DELETE
router
  .route("/:id")
  .get(protect, getProductByID)
  .patch(protect, upload.single("image"), updateProduct)
  .delete(protect, deleteProduct);

export default router;