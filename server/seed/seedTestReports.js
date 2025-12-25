// seed/seedTestReports.js
// Run with: node seed/seedTestReports.js  (after setting MONGO_URI in env)

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import Test from "../models/Test.js";
import TestReport from "../models/TestReport.js";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for test reports seeding");

    // Clear existing test reports
    await TestReport.deleteMany({});
    console.log("Cleared existing TestReport documents");

    // Ensure we have at least one doctor user and one patient user
    let doctorUser = await User.findOne({ role: "doctor" });
    if (!doctorUser) {
      doctorUser = await User.create({
        name: "Seed Doctor",
        email: "seed.doctor@example.com",
        password: "password",
        role: "doctor",
      });
      console.log("Created doctor user");
    }

    let patientUser = await User.findOne({ role: "patient" });
    if (!patientUser) {
      patientUser = await User.create({
        name: "Seed Patient",
        email: "seed.patient@example.com",
        password: "password",
        role: "patient",
      });
      console.log("Created patient user");
    }

    // Ensure Doctor profile exists for the doctor user
    let doctorProfile = await Doctor.findOne({ user_id: doctorUser._id });
    if (!doctorProfile) {
      doctorProfile = await Doctor.create({ user_id: doctorUser._id, specialization: "General" });
      console.log("Created Doctor profile");
    }

    // Create an appointment for the prescription
    const appointment = await Appointment.create({
      doctor_id: doctorProfile._id,
      patient_id: patientUser._id,
      date: new Date().toISOString().slice(0, 10),
      time: "09:00",
    });

    // Create a prescription linked to that appointment
    const prescription = await Prescription.create({
      appointment_id: appointment._id,
      doctor_id: doctorProfile._id,
      patient_id: patientUser._id,
      notes: "Seed prescription for test reports",
      tests: [
        { test_name: "Complete Blood Count (CBC)", description: "Seeded" },
        { test_name: "Serum Creatinine", description: "Seeded" }
      ]
    });

    // Link prescription back to appointment (optional)
    appointment.prescription_id = prescription._id;
    await appointment.save();

    // Ensure there are some Test documents to reference
    const testsInDb = await Test.find({}).limit(10);
    let testsToUse = testsInDb;
    if (testsInDb.length === 0) {
      const created = await Test.insertMany([
        { name: "Complete Blood Count (CBC)" },
        { name: "Serum Creatinine" },
        { name: "Liver Function Test (LFT)" }
      ]);
      testsToUse = created;
      console.log("Inserted sample Test documents");
    }

    // Build test report tests array (pick up to 3)
    const reportTests = testsToUse.slice(0, 3).map((t) => ({
      test: t._id,
      testName: t.name,
      showingDate: new Date()
    }));

    // Create the TestReport
    const report = await TestReport.create({
      prescription: prescription._id,
      patient: patientUser._id,
      doctor: doctorUser._id,
      tests: reportTests
    });

    console.log("Created TestReport:", report._id.toString());
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
