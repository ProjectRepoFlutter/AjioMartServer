const User = require('../models/User');
const crypto = require('crypto');
const sendVerificationCode = require('../utils/notification').sendVerificationCode; // Utility to send SMS or email

// Register User
exports.registerUser = async (req, res) => {
    const { email, phone, firstName,lastName } = req.body;
    const identifier = email || phone;

    try {
        // Check if the user already exists
        console.log("Finding User");
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a verification code
        console.log("Generating Verification");
        const verificationCode = crypto.randomBytes(3).toString('hex'); // Generate a random verification code

        // Create a new user
        console.log("Generating user");
        const user = new User({ email, phone, firstName,lastName, verificationCode });
        await user.save();

        // Send verification code
        console.log("sending Verification");
        await sendVerificationCode(identifier, verificationCode);
        console.log("verification sent");
        return res.status(200).json({ message: 'Registration successful! Please verify your account.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Verify User
exports.verifyUser = async (req, res) => {
    const { email, phone, verificationCode } = req.body;
    const identifier = email || phone;

    try {
        const user = await User.findOne({ $or: [{ email }, { phone }] });

        if (!user || user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationCode = null; // Clear the verification code after successful verification
        await user.save();

        return res.status(200).json({ message: 'Account verified successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// Login User
exports.loginUser = async (req, res) => {
  const { email, phone } = req.body;
  const identifier = email || phone;

  try {
      const user = await User.findOne({ $or: [{ email }, { phone }] });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Generate a new verification code
      const verificationCode = crypto.randomBytes(3).toString('hex');
      user.verificationCode = verificationCode;
      await user.save();

      // Send verification code
      await sendVerificationCode(identifier, verificationCode);

      return res.status(200).json({ message: 'Login successful! Please verify your identity.' });
  } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
  }
};
