import mongoose from 'mongoose';

/**
 * Parcel Schema
 * Represents a sender's parcel delivery request
 */
const parcelSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupCity: {
    type: String,
    required: [true, 'Please provide pickup city'],
    trim: true
  },
  dropCity: {
    type: String,
    required: [true, 'Please provide drop city'],
    trim: true
  },
  parcelSize: {
    type: String,
    enum: ['small', 'medium'],
    required: [true, 'Please specify parcel size']
  },
  parcelDescription: {
    type: String,
    required: [true, 'Please provide parcel description'],
    trim: true
  },
  rewardAmount: {
    type: Number,
    required: [true, 'Please provide reward amount'],
    min: [1, 'Reward must be at least ₹1'],
    max: [10000, 'Reward cannot exceed ₹10,000']
  },
  parcelImage: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Parcel+Image'
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'delivered', 'completed', 'cancelled'],
    default: 'requested'
  },
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  travelPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel',
    default: null
  },
  acceptedAt: {
    type: Date
  },
  pickedUpAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for searching parcels
parcelSchema.index({ pickupCity: 1, dropCity: 1, status: 1 });

// Validation for blocked keywords
parcelSchema.pre('save', function(next) {
  const blockedKeywords = ['drugs', 'weapon', 'alcohol', 'explosive', 'gun', 'knife'];
  const description = this.parcelDescription.toLowerCase();
  
  for (let keyword of blockedKeywords) {
    if (description.includes(keyword)) {
      return next(new Error(`Parcel description contains prohibited keyword: ${keyword}`));
    }
  }
  next();
});

const Parcel = mongoose.model('Parcel', parcelSchema);

export default Parcel;
