// server/routes/donorRoutes.js
import express from 'express';
import {
  getDonorDashboard,
  toggleAvailability,
  matchDonors,
  getIncomingRequests,     // ✅ NEW: see all pending requests
  completeDonation         // ✅ NEW: mark a donation as completed
} from '../controllers/donorController.js';

import { requireAuth, requireVerified } from '../middleware/authMiddleware.js';

const router = express.Router();

// Dashboard + Profile
router.get('/dashboard', requireAuth, requireVerified, getDonorDashboard);
router.patch('/availability', requireAuth, requireVerified, toggleAvailability);

// Optional: matching logic by patients (used in search)
router.get('/match', requireAuth, matchDonors);

// ✅ New routes for donor blood request handling
router.get('/requests', requireAuth, requireVerified, getIncomingRequests);
router.patch('/complete/:id', requireAuth, requireVerified, completeDonation);

export default router;
