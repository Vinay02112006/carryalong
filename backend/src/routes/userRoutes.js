import express from 'express';
import { uploadKYC, getUserProfile, verifyUserKYC, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/upload.js';

const router = express.Router();

router.post('/kyc', protect, upload.single('document'), uploadKYC);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.put('/:id/kyc/verify', protect, verifyUserKYC); // For demo, use protect not admin

export default router;
