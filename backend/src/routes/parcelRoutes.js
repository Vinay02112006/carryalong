import express from 'express';
import {
  createParcel,
  getAllParcels,
  searchParcels,
  getParcelById,
  getMySentParcels,
  getMyCarryingParcels,
  acceptParcel,
  updateParcelStatus,
  findMatchingTravels,
  deleteParcel
} from '../controllers/parcelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.route('/')
  .post(protect, createParcel)
  .get(protect, getAllParcels);

router.get('/search', protect, searchParcels);
router.get('/my/sent', protect, getMySentParcels);
router.get('/my/carrying', protect, getMyCarryingParcels);

router.route('/:id')
  .get(protect, getParcelById)
  .delete(protect, deleteParcel);

router.post('/:id/accept', protect, acceptParcel);
router.put('/:id/status', protect, updateParcelStatus);
router.get('/:id/matches', protect, findMatchingTravels);

export default router;
