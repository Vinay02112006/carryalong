import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getUserById
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/users/:id', protect, getUserById);

export default router;
