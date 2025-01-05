import express from "express";
import {
  logout,
  signIn,
  signUp,
  refreshToken,
  getProfiles,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh-token", refreshToken);
authRoutes.post("/profiles", protectedRoute, getProfiles);

export default authRoutes;
