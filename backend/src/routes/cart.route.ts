import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const cartRoutes = express.Router();

cartRoutes.post("/", protectedRoute, addToCart);
cartRoutes.get("/", protectedRoute, getCartProducts);
cartRoutes.delete("/delete", protectedRoute, removeAllFromCart);
cartRoutes.put("/update/:id", protectedRoute, updateQuantity);

export default cartRoutes;
