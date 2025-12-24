import express from 'express';
import {
  createTravel,
  getAllTravels,
  searchTravels,
  getTravelById,
  getMyTravels,
  updateTravelStatus,
  deleteTravel,
  findMatchingParcels
} from '../controllers/travelController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.route('/')
  .post(protect, createTravel)
  .get(protect, getAllTravels);

router.get('/search', protect, searchTravels);
router.get('/my/posts', protect, getMyTravels);

router.route('/:id')
  .get(protect, getTravelById)
  .delete(protect, deleteTravel);

router.put('/:id/status', protect, updateTravelStatus);
router.get('/:id/matches', protect, findMatchingParcels);

export default router;
