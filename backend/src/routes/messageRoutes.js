import express from 'express';
import {
  sendMessage,
  getMessagesByParcel,
  getConversations,
  markAsRead
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/parcel/:parcelId', protect, getMessagesByParcel);
router.put('/:id/read', protect, markAsRead);

export default router;
