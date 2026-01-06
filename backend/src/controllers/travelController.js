import Travel from '../models/Travel.js';
import Parcel from '../models/Parcel.js';

/**
 * @desc    Create a new travel post
 * @route   POST /api/travel
 * @access  Private
 */
export const createTravel = async (req, res, next) => {
  try {
    const { fromCity, toCity, date, time, vehicleType, availableSpace, fromCoordinates, toCoordinates } = req.body;

    const travel = await Travel.create({
      traveler: req.user._id,
      fromCity,
      toCity,
      date,
      time,
      vehicleType,
      availableSpace,
      fromCoordinates,
      toCoordinates
    });

    const populatedTravel = await Travel.findById(travel._id).populate('traveler', 'name phone rating');

    res.status(201).json(populatedTravel);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active travel posts
 * @route   GET /api/travel
 * @access  Private
 */
export const getAllTravels = async (req, res, next) => {
  try {
    const travels = await Travel.find({ status: 'active' })
      .populate('traveler', 'name phone rating')
      .sort({ date: 1 });

    res.json(travels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search travel routes by cities
 * @route   GET /api/travel/search?from=city1&to=city2
 * @access  Private
 */
export const searchTravels = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const query = { status: 'active' };

    if (from) {
      query.fromCity = { $regex: from, $options: 'i' };
    }

    if (to) {
      query.toCity = { $regex: to, $options: 'i' };
    }

    const travels = await Travel.find(query)
      .populate('traveler', 'name phone rating')
      .sort({ date: 1 });

    res.json(travels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get travel by ID
 * @route   GET /api/travel/:id
 * @access  Private
 */
export const getTravelById = async (req, res, next) => {
  try {
    const travel = await Travel.findById(req.params.id)
      .populate('traveler', 'name phone rating')
      .populate({
        path: 'acceptedParcels',
        populate: {
          path: 'sender',
          select: 'name phone'
        }
      });

    if (travel) {
      res.json(travel);
    } else {
      res.status(404);
      throw new Error('Travel post not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my travel posts
 * @route   GET /api/travel/my/posts
 * @access  Private
 */
export const getMyTravels = async (req, res, next) => {
  try {
    const travels = await Travel.find({ traveler: req.user._id })
      .populate({
        path: 'acceptedParcels',
        populate: {
          path: 'sender',
          select: 'name phone'
        }
      })
      .sort({ date: -1 });

    res.json(travels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update travel status
 * @route   PUT /api/travel/:id/status
 * @access  Private
 */
export const updateTravelStatus = async (req, res, next) => {
  try {
    const travel = await Travel.findById(req.params.id);

    if (!travel) {
      res.status(404);
      throw new Error('Travel post not found');
    }

    // Check if user is the traveler
    if (travel.traveler.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this travel post');
    }

    travel.status = req.body.status || travel.status;
    const updatedTravel = await travel.save();

    res.json(updatedTravel);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete travel post
 * @route   DELETE /api/travel/:id
 * @access  Private
 */
export const deleteTravel = async (req, res, next) => {
  try {
    const travel = await Travel.findById(req.params.id);

    if (!travel) {
      res.status(404);
      throw new Error('Travel post not found');
    }

    // Check if user is the traveler
    if (travel.traveler.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this travel post');
    }

    // Check if there are accepted parcels
    if (travel.acceptedParcels.length > 0) {
      res.status(400);
      throw new Error('Cannot delete travel post with accepted parcels');
    }

    await travel.deleteOne();

    res.json({ message: 'Travel post deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Find matching parcels for a travel route
 * @route   GET /api/travel/:id/matches
 * @access  Private
 */
export const findMatchingParcels = async (req, res, next) => {
  try {
    const travel = await Travel.findById(req.params.id);

    if (!travel) {
      res.status(404);
      throw new Error('Travel post not found');
    }

    // Find parcels matching the route
    const matchingParcels = await Parcel.find({
      pickupCity: { $regex: new RegExp(travel.fromCity, 'i') },
      dropCity: { $regex: new RegExp(travel.toCity, 'i') },
      status: 'requested',
      parcelSize: { $in: [travel.availableSpace, 'small'] } // small fits in both, medium only in medium
    }).populate('sender', 'name phone rating');

    res.json(matchingParcels);
  } catch (error) {
    next(error);
  }
};
