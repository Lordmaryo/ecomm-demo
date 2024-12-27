import express from "express";
import { logout, signIn, signUp } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/signin", signIn);
authRoutes.post("/signup", signUp);
authRoutes.post("/logout", logout);

export default authRoutes;