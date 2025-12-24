import Rating from '../models/Rating.js';
import Parcel from '../models/Parcel.js';
import User from '../models/User.js';

/**
 * @desc    Create a rating for a traveler
 * @route   POST /api/ratings
 * @access  Private
 */
export const createRating = async (req, res, next) => {
  try {
    const { parcelId, travelerId, rating, review } = req.body;

    // Verify parcel exists and is completed
    const parcel = await Parcel.findById(parcelId);
    
    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    // Check if user is the sender
    if (parcel.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only sender can rate the traveler');
    }

    // Check if parcel is completed
    if (parcel.status !== 'completed') {
      res.status(400);
      throw new Error('Can only rate after parcel is completed');
    }

    // Check if already rated
    const existingRating = await Rating.findOne({ parcel: parcelId });
    if (existingRating) {
      res.status(400);
      throw new Error('You have already rated this delivery');
    }

    // Create rating
    const newRating = await Rating.create({
      parcel: parcelId,
      sender: req.user._id,
      traveler: travelerId,
      rating,
      review
    });

    // Update traveler's rating
    await updateTravelerRating(travelerId);

    const populatedRating = await Rating.findById(newRating._id)
      .populate('sender', 'name')
      .populate('traveler', 'name rating');

    res.status(201).json(populatedRating);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get ratings for a traveler
 * @route   GET /api/ratings/traveler/:travelerId
 * @access  Private
 */
export const getTravelerRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ traveler: req.params.travelerId })
      .populate('sender', 'name')
      .populate('parcel', 'pickupCity dropCity')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get rating by parcel ID
 * @route   GET /api/ratings/parcel/:parcelId
 * @access  Private
 */
export const getRatingByParcel = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({ parcel: req.params.parcelId })
      .populate('sender', 'name')
      .populate('traveler', 'name rating');

    if (rating) {
      res.json(rating);
    } else {
      res.status(404);
      throw new Error('Rating not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to recalculate traveler's average rating
 */
const updateTravelerRating = async (travelerId) => {
  const ratings = await Rating.find({ traveler: travelerId });
  
  if (ratings.length > 0) {
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    await User.findByIdAndUpdate(travelerId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings: ratings.length
    });
  }
};
