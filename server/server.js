import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database/connectDB.js";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import ambulanceRoutes from "./routes/ambulanceRoutes.js";
import bloodRoutes from "./routes/bloodRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import testReportRoutes from "./routes/testReportRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import receptionRoutes from "./routes/receptionRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Body parsers (BEFORE CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",       // Vite dev
  "http://localhost:3000",       // CRA fallback
  "https://h-msystem.vercel.app" // production
];

const corsOptions = {
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return cb(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    
    console.warn(`CORS blocked for origin: ${origin}`);
    return cb(new Error(`CORS policy: origin not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count"], // If you send custom response headers
  optionsSuccessStatus: 200 // For legacy browsers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Preflight for all routes (handles OPTIONS requests)
app.options("*", cors(corsOptions)); // Use same config, not empty cors()

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-reports", testReportRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/reception", receptionRoutes);
app.use("/api/staff", staffRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware (catches CORS errors)
app.use((err, req, res, next) => {
  if (err.message.includes("CORS")) {
    console.error("CORS Error:", err.message);
    return res.status(403).json({ error: err.message });
  }
  next(err);
});

// Local dev listen only (Vercel runs as serverless)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel serverless export
export default app;
