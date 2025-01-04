import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { createCheckoutSession } from "../controllers/payment.controller";

const paymentRoutes = express.Router();

paymentRoutes.post(
  "/create-checkout-session",
  protectedRoute,
  createCheckoutSession
);

export default paymentRoutes;
