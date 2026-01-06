import mongoose from 'mongoose';

/**
 * Travel Schema
 * Represents a traveler's travel route post
 */
const travelSchema = new mongoose.Schema({
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromCity: {
    type: String,
    required: [true, 'Please provide starting city'],
    trim: true
  },
  toCity: {
    type: String,
    required: [true, 'Please provide destination city'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide travel date']
  },
  fromCoordinates: {
    lat: Number,
    lng: Number
  },
  toCoordinates: {
    lat: Number,
    lng: Number
  },
  time: {
    type: String,
    required: [true, 'Please provide travel time']
  },
  vehicleType: {
    type: String,
    enum: ['car', 'train', 'bus', 'flight'],
    required: [true, 'Please specify vehicle type']
  },
  availableSpace: {
    type: String,
    enum: ['small', 'medium'],
    required: [true, 'Please specify available space']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  acceptedParcels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parcel'
  }]
}, {
  timestamps: true
});

// Index for searching travel routes
travelSchema.index({ fromCity: 1, toCity: 1, status: 1, date: 1 });

const Travel = mongoose.model('Travel', travelSchema);

export default Travel;
