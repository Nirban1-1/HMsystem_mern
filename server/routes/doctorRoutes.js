// server/routes/doctorRoutes.js
import express from 'express';
import {
  getDoctorDashboard,
  addAvailableSlot,
  updateSpecialization,
  deleteSlot,
  createPrescription,
  getTreatedPatients,
  getPatientHistory,
  addTestSuggestion,
  uploadTestReport,
  getPrescriptionDetails
} from '../controllers/doctorController.js';
import { requireAuth, requireVerified } from '../middleware/authMiddleware.js'; // assuming the folder is 'middlewares'

const router = express.Router();

// Dashboard view (doctor info + appointments)
router.get('/dashboard', requireAuth, requireVerified, getDoctorDashboard);

// Add available slots (date + time)
router.post('/slots', requireAuth, requireVerified, addAvailableSlot);

// Update specialization
router.put('/specialization', requireAuth, requireVerified, updateSpecialization);

// DELETE /api/doctor/slots
router.delete('/slots', requireAuth, requireVerified, deleteSlot);

// POST /api/doctor/prescribe - Create prescription
router.post('/prescribe', requireAuth, requireVerified, createPrescription);

// GET /api/doctor/treated-patients - Get all treated patients
router.get('/treated-patients', requireAuth, requireVerified, getTreatedPatients);

// GET /api/doctor/patient-history/:patientId - Get patient treatment history
router.get('/patient-history/:patientId', requireAuth, requireVerified, getPatientHistory);

// GET /api/doctor/prescription/:prescriptionId - Get prescription details with tests
router.get('/prescription/:prescriptionId', requireAuth, getPrescriptionDetails);

// PUT /api/doctor/prescription/:prescriptionId/tests - Add test suggestion
router.put('/prescription/:prescriptionId/tests', requireAuth, requireVerified, addTestSuggestion);

// PUT /api/doctor/prescription/:prescriptionId/test/:testId/report - Upload test report
router.put('/prescription/:prescriptionId/test/:testId/report', requireAuth, uploadTestReport);

export default router;
