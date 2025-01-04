import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller";

const couponRoutes = express.Router();

couponRoutes.get("/", protectedRoute, getCoupon);
couponRoutes.get("/validate", protectedRoute, validateCoupon);

export default couponRoutes;
