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

// Connect DB (make sure your connectDB uses process.env.MONGO_URI)
connectDB();

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (allow your frontend)
const allowedOrigins = [
  "http://localhost:5173",       // Vite dev
  "http://localhost:3000",       // if sometimes using CRA
  "https://h-msystem.vercel.app" // your deployed frontend
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (Postman/curl)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight for all routes
app.options("*", cors()); // Helps with credentialed CORS preflight issues [web:223]

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

// Local dev listen only (Vercel will run it as a serverless function)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel serverless export
export default app;
