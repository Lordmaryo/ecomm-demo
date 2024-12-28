import express from "express";
import { logout, signIn, signUp, refreshToken } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.post("/logout", logout);
authRoutes.post("/refresh-token", refreshToken);

export default authRoutes;