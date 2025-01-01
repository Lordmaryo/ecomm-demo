import express from "express";
import { getAllProducts, getFeaturedProducts } from "../controllers/product.controller";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";

const productRoutes = express.Router();

productRoutes.get("/", protectedRoute, adminRoute, getAllProducts);
productRoutes.get("/featured", getFeaturedProducts);

export default productRoutes;
