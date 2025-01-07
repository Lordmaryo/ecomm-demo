import express from "express";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import cartRoutes from "./routes/cart.route";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import couponRoutes from "./routes/coupon.route";
import paymentRoutes from "./routes/payment.route";
import analyticsRoutes from "./routes/analytics.route";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_DEV_URL,
    credentials: true,
  }) 
);

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
