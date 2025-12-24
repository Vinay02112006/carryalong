import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, governmentId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      governmentId
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        governmentId: user.governmentId,
        rating: user.rating,
        totalRatings: user.totalRatings,
        earnings: user.earnings,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        governmentId: user.governmentId,
        rating: user.rating,
        totalRatings: user.totalRatings,
        earnings: user.earnings,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        governmentId: user.governmentId,
        rating: user.rating,
        totalRatings: user.totalRatings,
        earnings: user.earnings,
        createdAt: user.createdAt
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.governmentId = req.body.governmentId || user.governmentId;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        governmentId: updatedUser.governmentId,
        rating: updatedUser.rating,
        totalRatings: updatedUser.totalRatings,
        earnings: updatedUser.earnings,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/auth/users/:id
 * @access  Private
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        rating: user.rating,
        totalRatings: user.totalRatings,
        createdAt: user.createdAt
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
