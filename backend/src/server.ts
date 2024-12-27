import express from "express";
import authRoutes from "./routes/auth.route";
import { connectDB } from "./lib/db";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});
