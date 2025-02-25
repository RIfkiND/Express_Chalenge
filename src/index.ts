import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import gadgetsRoutes from "./routes/gadget"
import dotenv from "dotenv";
import { Auth } from "./middlewares/auth";
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Public Route
app.get("/", (req, res) => {
  res.send("This Is just Simple Express API");
});
app.use("/api/v1/auth", authRoutes);

//Auth Route
app.use("/api/v1/gadgets",Auth ,gadgetsRoutes)


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
export default app;
