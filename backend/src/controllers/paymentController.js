import Payment from '../models/Payment.js';

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
