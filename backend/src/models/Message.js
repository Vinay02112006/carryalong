import mongoose from 'mongoose';

/**
 * Message Schema
 * Simple chat system for sender-traveler communication
 */
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcel',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient message retrieval
messageSchema.index({ parcel: 1, createdAt: 1 });
messageSchema.index({ sender: 1, receiver: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
