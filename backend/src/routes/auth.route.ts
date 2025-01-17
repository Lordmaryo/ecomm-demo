import express from "express";
import {
  logout,
  signIn,
  signUp,
  refreshToken,
  getProfiles,
  verifyEmail,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.get("/profiles", protectedRoute, getProfiles);
authRoutes.post("/verify-email", verifyEmail);

export default authRoutes;
