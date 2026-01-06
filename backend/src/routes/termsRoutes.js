import express from 'express';
import { getTerms, acceptTerms } from '../controllers/termsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTerms); // Public
router.post('/accept', protect, acceptTerms); // Protected

export default router;
