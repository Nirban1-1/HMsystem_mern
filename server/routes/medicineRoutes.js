import express from 'express';
import { getAllMedicines, getMedicineById, searchMedicines, autocompleteMedicines } from '../controllers/medicineController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getAllMedicines);
router.get('/search', requireAuth, searchMedicines);
router.get('/autocomplete', requireAuth, autocompleteMedicines);
router.get('/:id', requireAuth, getMedicineById);

export default router;
