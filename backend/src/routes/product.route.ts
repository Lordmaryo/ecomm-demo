import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeauturedProduct,
} from "../controllers/product.controller";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";

const productRoutes = express.Router();

productRoutes.get("/", protectedRoute, adminRoute, getAllProducts);
productRoutes.get("/featured", getFeaturedProducts);
productRoutes.get("/recommendation", getRecommendedProducts);
productRoutes.get("/category/:category", getProductsByCategory);
productRoutes.post("/", protectedRoute, adminRoute, createProduct);
productRoutes.patch(
  "/update_feature/:id",
  protectedRoute,
  adminRoute,
  toggleFeauturedProduct
);
productRoutes.delete("/delete/:id", protectedRoute, adminRoute, deleteProduct);

export default productRoutes;
