import express from "express";
import { adminRoute, protectedRoute } from "../middleware/auth.middleware";
import { getAnalytics } from "../controllers/analytics.controller";

const analyticsRoutes = express.Router();

analyticsRoutes.get("/", protectedRoute, adminRoute, getAnalytics);

export default analyticsRoutes;
