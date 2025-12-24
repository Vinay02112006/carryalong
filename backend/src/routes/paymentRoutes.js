import express from 'express';
import {
  getPaymentByParcel,
  getMyEarnings,
  getMySentPayments
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/parcel/:parcelId', protect, getPaymentByParcel);
router.get('/my/earnings', protect, getMyEarnings);
router.get('/my/sent', protect, getMySentPayments);

export default router;
