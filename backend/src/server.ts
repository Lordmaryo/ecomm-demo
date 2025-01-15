import "dotenv/config";
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
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
