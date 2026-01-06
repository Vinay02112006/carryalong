import Parcel from '../models/Parcel.js';
import Travel from '../models/Travel.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

/**
 * @desc    Create a new parcel request
 * @route   POST /api/parcels
 * @access  Private
 */
export const createParcel = async (req, res, next) => {
  try {
    const { pickupCity, dropCity, parcelSize, parcelDescription, rewardAmount, parcelImage, pickupCoordinates, dropCoordinates } = req.body;

    const parcel = await Parcel.create({
      sender: req.user._id,
      pickupCity,
      dropCity,
      parcelSize,
      parcelDescription,
      rewardAmount,
      parcelImage,
      pickupCoordinates,
      dropCoordinates
    });

    const populatedParcel = await Parcel.findById(parcel._id).populate('sender', 'name phone rating');

    res.status(201).json(populatedParcel);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all parcel requests
 * @route   GET /api/parcels
 * @access  Private
 */
export const getAllParcels = async (req, res, next) => {
  try {
    const parcels = await Parcel.find({ status: 'requested' })
      .populate('sender', 'name phone rating')
      .sort({ createdAt: -1 });

    res.json(parcels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search parcels by cities
 * @route   GET /api/parcels/search?from=city1&to=city2
 * @access  Private
 */
export const searchParcels = async (req, res, next) => {
  try {
    const { from, to, status } = req.query;

    const query = {};

    if (from) {
      query.pickupCity = { $regex: from, $options: 'i' };
    }

    if (to) {
      query.dropCity = { $regex: to, $options: 'i' };
    }

    if (status) {
      query.status = status;
    } else {
      query.status = 'requested';
    }

    const parcels = await Parcel.find(query)
      .populate('sender', 'name phone rating')
      .sort({ createdAt: -1 });

    res.json(parcels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get parcel by ID
 * @route   GET /api/parcels/:id
 * @access  Private
 */
export const getParcelById = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('sender', 'name phone rating')
      .populate('traveler', 'name phone rating')
      .populate('travelPost');

    if (parcel) {
      res.json(parcel);
    } else {
      res.status(404);
      throw new Error('Parcel not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my sent parcels
 * @route   GET /api/parcels/my/sent
 * @access  Private
 */
export const getMySentParcels = async (req, res, next) => {
  try {
    const parcels = await Parcel.find({ sender: req.user._id })
      .populate('traveler', 'name phone rating')
      .populate('travelPost')
      .sort({ createdAt: -1 });

    res.json(parcels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get parcels I'm carrying
 * @route   GET /api/parcels/my/carrying
 * @access  Private
 */
export const getMyCarryingParcels = async (req, res, next) => {
  try {
    const parcels = await Parcel.find({
      traveler: req.user._id,
      status: { $in: ['accepted', 'picked_up', 'delivered'] }
    })
      .populate('sender', 'name phone rating')
      .populate('travelPost')
      .sort({ acceptedAt: -1 });

    res.json(parcels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Accept a parcel request (traveler)
 * @route   POST /api/parcels/:id/accept
 * @access  Private
 */
export const acceptParcel = async (req, res, next) => {
  try {
    const { travelPostId } = req.body;

    const parcel = await Parcel.findById(req.params.id);
    const travel = await Travel.findById(travelPostId);

    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    if (!travel) {
      res.status(404);
      throw new Error('Travel post not found');
    }

    // Check if parcel is still available
    if (parcel.status !== 'requested') {
      res.status(400);
      throw new Error('Parcel is no longer available');
    }

    // Check if user is the traveler
    if (travel.traveler.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to accept for this travel post');
    }

    // Check if routes match
    const routeMatch =
      parcel.pickupCity.toLowerCase() === travel.fromCity.toLowerCase() &&
      parcel.dropCity.toLowerCase() === travel.toCity.toLowerCase();

    if (!routeMatch) {
      res.status(400);
      throw new Error('Parcel route does not match travel route');
    }

    // Check space compatibility
    if (travel.availableSpace === 'small' && parcel.parcelSize === 'medium') {
      res.status(400);
      throw new Error('Parcel size exceeds available space');
    }

    // Update parcel
    parcel.status = 'accepted';
    parcel.traveler = req.user._id;
    parcel.travelPost = travelPostId;
    parcel.acceptedAt = new Date();
    await parcel.save();

    // Add parcel to travel post
    travel.acceptedParcels.push(parcel._id);
    await travel.save();

    // Create payment (mock escrow - hold funds)
    await Payment.create({
      parcel: parcel._id,
      sender: parcel.sender,
      traveler: req.user._id,
      amount: parcel.rewardAmount,
      status: 'held'
    });

    const updatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name phone rating')
      .populate('traveler', 'name phone rating')
      .populate('travelPost');

    res.json(updatedParcel);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update parcel status
 * @route   PUT /api/parcels/:id/status
 * @access  Private
 */
export const updateParcelStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    // Authorization check
    const isTraveler = parcel.traveler && parcel.traveler.toString() === req.user._id.toString();
    const isSender = parcel.sender.toString() === req.user._id.toString();

    if (!isTraveler && !isSender) {
      res.status(403);
      throw new Error('Not authorized to update this parcel');
    }

    // Status flow validation
    const allowedTransitions = {
      'accepted': ['picked_up', 'cancelled'],
      'picked_up': ['delivered'],
      'delivered': ['completed']
    };

    if (!allowedTransitions[parcel.status] || !allowedTransitions[parcel.status].includes(status)) {
      res.status(400);
      throw new Error(`Cannot transition from ${parcel.status} to ${status}`);
    }

    // Update status and timestamp
    parcel.status = status;

    if (status === 'picked_up') {
      parcel.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      parcel.deliveredAt = new Date();
    } else if (status === 'completed') {
      parcel.completedAt = new Date();

      // Release payment and update traveler earnings
      const payment = await Payment.findOne({ parcel: parcel._id });
      if (payment && payment.status === 'held') {
        payment.status = 'released';
        payment.releasedAt = new Date();
        await payment.save();

        // Update traveler earnings
        const traveler = await User.findById(parcel.traveler);
        traveler.earnings += payment.amount;
        await traveler.save();
      }
    }

    await parcel.save();

    const updatedParcel = await Parcel.findById(parcel._id)
      .populate('sender', 'name phone rating')
      .populate('traveler', 'name phone rating')
      .populate('travelPost');

    res.json(updatedParcel);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Find matching travel routes for a parcel
 * @route   GET /api/parcels/:id/matches
 * @access  Private
 */
export const findMatchingTravels = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    // Find travel posts matching the route
    const matchingTravels = await Travel.find({
      fromCity: { $regex: new RegExp(parcel.pickupCity, 'i') },
      toCity: { $regex: new RegExp(parcel.dropCity, 'i') },
      status: 'active',
      $or: [
        { availableSpace: 'medium' },
        { availableSpace: parcel.parcelSize }
      ]
    }).populate('traveler', 'name phone rating');

    res.json(matchingTravels);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete parcel (only if not accepted)
 * @route   DELETE /api/parcels/:id
 * @access  Private
 */
export const deleteParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    // Check if user is the sender
    if (parcel.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this parcel');
    }

    // Can only delete if status is requested
    if (parcel.status !== 'requested') {
      res.status(400);
      throw new Error('Cannot delete parcel that has been accepted');
    }

    await parcel.deleteOne();

    res.json({ message: 'Parcel deleted' });
  } catch (error) {
    next(error);
  }
};
