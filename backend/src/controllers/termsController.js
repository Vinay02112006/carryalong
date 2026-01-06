/**
 * @desc    Get Terms and Conditions
 * @route   GET /api/terms
 * @access  Public
 */
export const getTerms = async (req, res, next) => {
    try {
        const terms = {
            version: '1.0.0',
            lastUpdated: '2024-01-01',
            content: `
# Terms and Conditions - CarryAlong

## 1. Acceptance of Terms
By using CarryAlong, you agree to these terms and conditions. If you do not agree, please do not use our services.

## 2. User Responsibilities

### 2.1 For Senders
- You must provide accurate information about the parcel
- You are responsible for the contents of your parcel
- Prohibited items include: weapons, illegal substances, hazardous materials, perishable goods without proper packaging
- You must ensure pickup and delivery addresses are accurate
- Payment must be made as agreed before delivery begins

### 2.2 For Travelers
- You must handle parcels with reasonable care
- You are responsible for the parcel from pickup until delivery
- You must verify parcel contents before accepting
- You must deliver to the correct recipient
- You must not open or tamper with parcels

## 3. Liability and Insurance

### 3.1 Platform Liability
- CarryAlong acts as a platform connecting users
- We are not responsible for lost, damaged, or delayed parcels
- We are not responsible for disputes between users
- We do not inspect parcels or verify contents

### 3.2 User Liability
- Senders are liable for prohibited or dangerous items
- Travelers are liable for negligence or intentional damage
- Users must resolve disputes directly or through legal channels

### 3.3 Insurance
- Platform does not provide insurance coverage
- Users are encouraged to obtain their own insurance
- Maximum compensation claim is limited to the reward amount
- Claims must be filed within 7 days of delivery date

## 4. Payment Terms
- All payments are held in escrow until delivery confirmation
- Refunds are provided only for cancelled deliveries
- Platform fees may apply (currently waived)
- Disputes must be reported within 48 hours

## 5. Privacy and Data
- We collect and store user information as per our Privacy Policy
- We may share necessary information between senders and travelers
- We do not sell user data to third parties

## 6. Termination
- We reserve the right to suspend or terminate accounts for violations
- Users may close their accounts at any time
- Outstanding deliveries must be completed before account closure

## 7. Changes to Terms
- We may update these terms at any time
- Continued use after changes constitutes acceptance
- Major changes will be notified via email

## 8. Contact
For questions about these terms, contact us at support@carryalong.com

**By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.**
            `
        };

        res.json(terms);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Accept Terms and Conditions
 * @route   POST /api/terms/accept
 * @access  Private
 */
export const acceptTerms = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.termsAccepted = true;
        user.termsAcceptedAt = new Date();

        await user.save();

        res.json({
            message: 'Terms accepted successfully',
            termsAccepted: true,
            termsAcceptedAt: user.termsAcceptedAt
        });
    } catch (error) {
        next(error);
    }
};

import User from '../models/User.js';
