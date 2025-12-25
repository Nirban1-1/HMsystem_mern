import express from "express";
import {
  createTestReport,
  getTestReportsByPrescription,
} from "../controllers/testReportController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createTestReport);
router.get("/prescription/:prescriptionId", requireAuth, getTestReportsByPrescription);

export default router;
