// models/TestReport.js  (reports linked to prescription and patient)
import mongoose from "mongoose";

const testReportSchema = new mongoose.Schema(
  {
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tests: [
      {
        test: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Test",
          required: true,
        },
        testName: {
          type: String,
          required: true,
        },
        showingDate: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("TestReport", testReportSchema);
