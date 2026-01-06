import express from 'express';
import {
  getPaymentByParcel,
  getMyEarnings,
  getMySentPayments,
  createPaymentIntent,
  confirmPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.get('/parcel/:parcelId', protect, getPaymentByParcel);
router.get('/my/earnings', protect, getMyEarnings);
router.get('/my/sent', protect, getMySentPayments);
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);

export default router;
