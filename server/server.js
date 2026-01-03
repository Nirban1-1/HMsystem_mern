import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/connectDB.js';
import mongoose from 'mongoose';
import cors from "cors";

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import ambulanceRoutes from './routes/ambulanceRoutes.js';
import bloodRoutes from './routes/bloodRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import testRoutes from "./routes/testRoutes.js";
import testReportRoutes from "./routes/testReportRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import receptionRoutes from './routes/receptionRoutes.js';
import staffRoutes from './routes/staffRoutes.js';

dotenv.config();
connectDB(); 

const app = express();

// CORS middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://hmsystem-mern.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/blood', bloodRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/test-reports", testReportRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/reception', receptionRoutes);
app.use('/api/staff', staffRoutes);



app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));