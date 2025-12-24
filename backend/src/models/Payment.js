import mongoose from 'mongoose';

/**
 * Payment Schema
 * Mock escrow payment system
 */
const paymentSchema = new mongoose.Schema({
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcel',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['held', 'released', 'refunded'],
    default: 'held'
  },
  heldAt: {
    type: Date,
    default: Date.now
  },
  releasedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for tracking payments
paymentSchema.index({ parcel: 1 });
paymentSchema.index({ traveler: 1, status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
