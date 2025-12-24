import mongoose from 'mongoose';

/**
 * Rating Schema
 * Tracks ratings given by senders to travelers
 */
const ratingSchema = new mongoose.Schema({
  parcel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcel',
    required: true,
    unique: true // One rating per parcel
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
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for efficient rating queries
ratingSchema.index({ traveler: 1 });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
