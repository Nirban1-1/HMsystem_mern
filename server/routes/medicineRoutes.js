import express from 'express';
import { getAllMedicines, getMedicineById, searchMedicines } from '../controllers/medicineController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getAllMedicines);
router.get('/search', requireAuth, searchMedicines);
router.get('/:id', requireAuth, getMedicineById);

export default router;
