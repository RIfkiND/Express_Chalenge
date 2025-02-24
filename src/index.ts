import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import gadgetsRoutes from "./routes/gadget"
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/gadgets",gadgetsRoutes)

export default app;
