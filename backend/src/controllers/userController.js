import User from '../models/User.js';

/**
 * @desc    Upload KYC Document
 * @route   POST /api/users/kyc
 * @access  Private
 */
export const uploadKYC = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('Please upload a file');
        }

        const user = await User.findById(req.user._id);

        // Save relative path
        user.kycDocument = `/uploads/kyc/${req.file.filename}`;
        user.kycStatus = 'pending';

        await user.save();

        res.json({
            message: 'KYC document uploaded successfully',
            kycStatus: user.kycStatus,
            kycDocument: user.kycDocument
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get User Profile (Extended)
 * @route   GET /api/users/profile
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
                role: user.role,
                kycStatus: user.kycStatus,
                kycDocument: user.kycDocument,
                rating: user.rating
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
 * @desc    Verify User KYC (Admin Mock)
 * @route   PUT /api/users/:id/kyc/verify
 * @access  Private (Admin only ideally, but public for demo)
 */
export const verifyUserKYC = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.kycStatus = 'verified';
        await user.save();

        res.json({ message: 'User verification status updated', kycStatus: 'verified' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update User Profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;

            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    res.status(400);
                    throw new Error('Email already exists');
                }
                user.email = req.body.email;
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                kycStatus: updatedUser.kycStatus,
                kycDocument: updatedUser.kycDocument,
                rating: updatedUser.rating
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
