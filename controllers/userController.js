const User = require('../models/User');
const Otp = require('../models/otpModel')
const crypto = require('crypto');
const sendVerificationCode = require('../utils/notification').sendVerificationCode; // Utility to send SMS or email

//sendOtp
exports.sendOtp = async (req, res) => {
  const { email, phone } = req.body;
  const identifier = email || phone;
  try {
    console.log("Generating Verification");
    const verificationCode = crypto.randomBytes(3).toString('hex'); // Generate a random verification code
    console.log("Generated Verification");
    // Send verification code
    const existingUser = await Otp.findOne({ $or: [{ email }, { phone }] });
    let otpEntry;
    if (existingUser) { 
      console.log("Found existing user");
      existingUser.otp = verificationCode; } else {
      console.log("saving new Otp");
      if (/\S+@\S+\.\S+/.test(identifier)) {
        // If identifier matches email pattern
        otpEntry = new Otp({ email: identifier, otp: verificationCode });
    } else {
        // Treat identifier as a phone number
        otpEntry = new Otp({ phone: identifier, otp: verificationCode });
    }
      console.log("saving in mongoDB");
      await otpEntry.save();
    }

    console.log("sending Verification");
    await sendVerificationCode(identifier, verificationCode);
    console.log("verification sent");
    return res.status(200).json({ message: 'Otp sent successfully.' });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
// Register User
exports.registerUser = async (req, res) => {
  const { email, phone, firstName, lastName } = req.body;
  const identifier = email || phone;
  
  try {
    // Check if the user already exists
    console.log("Finding User");
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a verification code
    // console.log("Generating Verification");
    // const verificationCode = crypto.randomBytes(3).toString('hex'); // Generate a random verification code

    // Create a new user
    console.log("Generating user");
    const user = new User({ email, phone, firstName, lastName });
    await user.save();

    // // Send verification code
    // console.log("sending Verification");
    // await sendVerificationCode(identifier, verificationCode);
    // console.log("verification sent");
    return res.status(200).json({ message: 'Registration successful! ' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify User
exports.verifyUser = async (req, res) => {
  const { email, phone, otp } = req.body;
  const identifier = email || phone;

  try {
    const user = await Otp.findOne({ $or: [{ email }, { phone }] });
    console.log(user.otp);
    console.log(otp);
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Mark user as verified
    user.isUsed = true;
    user.otp = "null"; // Clear the verification code after successful verification
    console.log("saving in db");
    await user.save();

    return res.status(200).json({ message: 'Account verified successfully!' });
  } catch (error) {
    console.error('Verification error:', error);
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

    // // Generate a new verification code
    // const verificationCode = crypto.randomBytes(3).toString('hex');
    // user.verificationCode = verificationCode;
    // await user.save();

    // Send verification code
    // await sendVerificationCode(identifier, verificationCode);

    return res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
