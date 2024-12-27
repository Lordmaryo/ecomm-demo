import express from "express";
import { logout, signIn, signUp } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.get("/signin", signIn);
authRoutes.get("/signup", signUp);
authRoutes.get("/logout", logout);

export default authRoutes;