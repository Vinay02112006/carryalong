import Payment from '../models/Payment.js';
import Parcel from '../models/Parcel.js';
import User from '../models/User.js';
import stripe from '../config/stripe.js';

/**
 * @desc    Get payment by parcel ID
 * @route   GET /api/payments/parcel/:parcelId
 * @access  Private
 */
export const getPaymentByParcel = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ parcel: req.params.parcelId })
      .populate('sender', 'name')
      .populate('traveler', 'name');

    if (payment) {
      res.json(payment);
    } else {
      res.status(404);
      throw new Error('Payment not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my earnings (for travelers)
 * @route   GET /api/payments/my/earnings
 * @access  Private
 */
export const getMyEarnings = async (req, res, next) => {
  try {
    const payments = await Payment.find({ traveler: req.user._id })
      .populate('parcel', 'pickupCity dropCity status')
      .sort({ createdAt: -1 });

    const totalHeld = payments
      .filter(p => p.status === 'held')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalReleased = payments
      .filter(p => p.status === 'released')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      payments,
      summary: {
        totalHeld,
        totalReleased,
        totalEarnings: totalReleased
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my payments (for senders)
 * @route   GET /api/payments/my/sent
 * @access  Private
 */
export const getMySentPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ sender: req.user._id })
      .populate('parcel', 'pickupCity dropCity status')
      .populate('traveler', 'name rating')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    next(error);
  }
};

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { parcelId } = req.body;

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) {
      res.status(404);
      throw new Error('Parcel not found');
    }

    // Only sender pays
    if (parcel.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parcel.rewardAmount * 100,
      currency: 'inr',
      metadata: {
        parcelId: parcel._id.toString(),
        senderId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, parcelId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      res.status(400);
      throw new Error('Payment failed or pending');
    }

    // Check if payment record exists
    let payment = await Payment.findOne({ parcel: parcelId });

    if (!payment) {
      const parcel = await Parcel.findById(parcelId);
      payment = await Payment.create({
        parcel: parcelId,
        sender: req.user._id,
        traveler: parcel.traveler,
        amount: parcel.rewardAmount,
        status: 'held',
        paymentIntentId,
        heldAt: new Date()
      });
    } else {
      payment.status = 'held';
      payment.paymentIntentId = paymentIntentId;
      payment.heldAt = new Date();
      await payment.save();
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
};
