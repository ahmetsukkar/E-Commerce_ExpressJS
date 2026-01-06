import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";
import { seedInitialProducts } from "./services/productService";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173'
// }));

mongoose
  .connect(process.env.CONNECTION_STRING || '')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

seedInitialProducts()
.catch((error) => console.error('Error seeding products:', error));

app.use("/user", userRoutes);
app.use("/product", productRoute);
app.use("/cart", cartRoute);

// Error handler must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
