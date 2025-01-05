import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  checkoutSucess,
  createCheckoutSession,
} from "../controllers/payment.controller";

const paymentRoutes = express.Router();

paymentRoutes.post(
  "/create-checkout-session",
  protectedRoute,
  createCheckoutSession
);
paymentRoutes.post("/checkout-success", protectedRoute, checkoutSucess);

export default paymentRoutes;
