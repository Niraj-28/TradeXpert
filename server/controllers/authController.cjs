const User = require("../models/User.cjs");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// GENERATE JWT

const generateToken = (id) => {

  return jwt.sign(

    { id },

    process.env.JWT_SECRET,

    {

      expiresIn: "30d",

    }

  );

};

// REGISTER USER

const registerUser = async (

  req,
  res

) => {

  try {

    const {

      name,
      email,
      password,
      phone,

    } = req.body;

    // CHECK USER EXISTS

    const userExists = await User.findOne({

      email,

    });

    if (userExists) {

      return res.status(400).json({

        message: "User already exists",

      });

    }

    // HASH PASSWORD

    const salt = await bcrypt.genSalt(10);

    const hashedPassword =

      await bcrypt.hash(

        password,

        salt

      );

    // CREATE USER

    const user = await User.create({

      name,
      email,
      password: hashedPassword,
      phone,

    });

    // RESPONSE

    res.status(201).json({

      _id: user._id,

      name: user.name,

      email: user.email,

      phone: user.phone,

      balance: user.balance !== undefined ? user.balance : 1000000,

      token: generateToken(user._id),

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// LOGIN USER

const loginUser = async (

  req,
  res

) => {

  try {

    const {

      email,
      password,

    } = req.body;

    // FIND USER

    const user = await User.findOne({

      email,

    });

    // CHECK PASSWORD

    if (

      user &&

      (await bcrypt.compare(

        password,

        user.password

      ))

    ) {

      res.status(200).json({

        _id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        balance: user.balance !== undefined ? user.balance : 1000000,

        token: generateToken(user._id),

      });

    } else {

      res.status(401).json({

        message: "Invalid email or password",

      });

    }

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      username: user.username || "",
      bio: user.bio || "",
      balance: user.balance !== undefined ? user.balance : 1000000,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER PROFILE
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.username = req.body.username !== undefined ? req.body.username : user.username;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already taken" });
      }
      user.email = req.body.email;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      username: updatedUser.username || "",
      bio: updatedUser.bio || "",
      balance: updatedUser.balance !== undefined ? updatedUser.balance : 1000000,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEND OTP
const sendOtp = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    if (!emailOrPhone) {
      return res.status(400).json({ message: "Email or Phone is required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email/phone number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    console.log(`\n==================================================`);
    console.log(`🔑 [OTP SYSTEM] Verification Code for ${user.email}: ${otp}`);
    console.log(`==================================================\n`);

    res.status(200).json({ success: true, message: "OTP sent successfully to email/mobile" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;
    if (!emailOrPhone || !otp) {
      return res.status(400).json({ message: "Email/Phone and OTP are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp || new Date() > user.resetOtpExpires) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET FORGOTTEN PASSWORD
const resetForgottenPassword = async (req, res) => {
  try {
    const { emailOrPhone, otp, newPassword } = req.body;
    if (!emailOrPhone || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp || new Date() > user.resetOtpExpires) {
      return res.status(400).json({ message: "Verification failed. Please request a new OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {

  registerUser,

  loginUser,

  getUserProfile,

  updateUserProfile,

  changePassword,

  sendOtp,

  verifyOtp,

  resetForgottenPassword,

};