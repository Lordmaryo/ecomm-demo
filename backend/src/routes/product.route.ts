import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct
} from "../controllers/product.controller";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";

const productRoutes = express.Router();

productRoutes.get("/", protectedRoute, adminRoute, getAllProducts);
productRoutes.get("/featured", getFeaturedProducts);
productRoutes.post("/", protectedRoute, adminRoute, createProduct);
productRoutes.delete("/delete/:id", protectedRoute, adminRoute, deleteProduct);

export default productRoutes;
