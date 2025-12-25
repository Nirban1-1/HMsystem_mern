// controllers/testReportController.js
import TestReport from "../models/TestReport.js";
import Test from "../models/Test.js";

export const createTestReport = async (req, res) => {
  try {
    const { prescriptionId, patientId, tests } = req.body;
    const doctorId = req.user._id; // from auth middleware

    if (!prescriptionId || !patientId || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    // Map incoming tests: [{ testId, testName, showingDate }]
    const formattedTests = tests.map((t) => ({
      test: t.testId,
      testName: t.testName,
      showingDate: new Date(t.showingDate),
    }));

    const report = await TestReport.create({
      prescription: prescriptionId,
      patient: patientId,
      doctor: doctorId,
      tests: formattedTests,
    });

    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTestReportsByPrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const reports = await TestReport.find({ prescription: prescriptionId })
      .populate("tests.test")
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
