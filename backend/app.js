import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config({ path: "./config/config.env" });

const app = express();
const port = process.env.PORT || 5000;

// ✅ Connect to DB
connectDB();

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  "https://expense-tracker-app-2qut.onrender.com",
];

// ✅ CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ include OPTIONS
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ allow headers
  })
);

// ✅ Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ✅ API routes
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ✅ Error Handling for CORS
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS Error: Origin not allowed" });
  }
  next(err);
});

// ✅ Server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
