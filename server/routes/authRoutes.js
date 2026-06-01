import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { 
  registerUser, 
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  sendOtp,
  verifyOtp,
  resetForgottenPassword
} = require("../controllers/authController.cjs");
const protect = require("../middleware/authMiddleware.cjs");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Profile (Get/Update)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// Password Change
router.put("/change-password", protect, changePassword);

// Send OTP / Verify OTP
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Reset Forgotten Password
router.post("/reset-forgotten-password", resetForgottenPassword);

export default router;