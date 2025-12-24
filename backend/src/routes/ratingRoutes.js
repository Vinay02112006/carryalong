import express from 'express';
import {
  createRating,
  getTravelerRatings,
  getRatingByParcel
} from '../controllers/ratingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, createRating);
router.get('/traveler/:travelerId', protect, getTravelerRatings);
router.get('/parcel/:parcelId', protect, getRatingByParcel);

export default router;
