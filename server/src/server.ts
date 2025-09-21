import express, {Application, Request, Response, NextFunction} from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan';
import connectDB from './config/db';
import errorMiddleware from './middleware/errorMiddleware';
import cookieParser from "cookie-parser";


// Import Routes
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import cartRoutes from "./routes/cartRoutes";

dotenv.config();
const app: Application = express();

app.use(express.json({ limit: "5mb" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


connectDB();

// Routes
app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes)


// Global Error Middleware
app.use(errorMiddleware)


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    
})