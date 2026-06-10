const User = require("../models/User.cjs");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (e) {
  nodemailer = null;
}

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
      username: user.username || "",
      bio: user.bio || "",
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
        username: user.username || "",
        bio: user.bio || "",
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

    // Enforce 60-second cooldown rate limit
    if (user.resetOtpLastSent && (new Date() - user.resetOtpLastSent < 60000)) {
      const secondsLeft = Math.ceil((60000 - (new Date() - user.resetOtpLastSent)) / 1000);
      return res.status(429).json({ message: `Please wait ${secondsLeft} seconds before requesting a new OTP.` });
    }

    // Generate numeric 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    user.resetOtpAttempts = 0; // Reset incorrect attempts counter
    user.resetOtpLastSent = new Date();
    await user.save();

    let emailSent = false;

    // Send via nodemailer if SMTP is fully configured
    if (nodemailer) {
      const isSmtpConfigured =
        process.env.SMTP_HOST &&
        process.env.SMTP_PORT &&
        process.env.SMTP_USER &&
        process.env.SMTP_USER !== "your_email@gmail.com" &&
        process.env.SMTP_PASS &&
        process.env.SMTP_PASS !== "your_gmail_app_password";

      if (isSmtpConfigured) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          const fromEmail = process.env.SMTP_FROM || `"TradeXpert Security" <${process.env.SMTP_USER}>`;

          const mailOptions = {
            from: fromEmail,
            to: user.email,
            subject: "🔑 Your TradeXpert Verification Code",
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0c1a17; border: 1px solid #1e3d33; border-radius: 12px; color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #408A71; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">TradeXpert</h1>
                  <p style="color: #a3b8cc; font-size: 13px; margin: 5px 0 0 0;">Virtual Stock Trading Simulator</p>
                </div>
                <div style="background-color: #122822; padding: 25px; border-radius: 8px; border: 1px solid #204539; margin-bottom: 25px;">
                  <h2 style="font-size: 18px; font-weight: 700; color: #B0E4CC; margin-top: 0; margin-bottom: 15px; text-align: center;">Reset Your Password</h2>
                  <p style="font-size: 14px; line-height: 22px; color: #a3b8cc; margin-bottom: 20px;">
                    We received a request to reset your TradeXpert account password. Use the verification code below to proceed. This code is valid for <strong>10 minutes</strong>.
                  </p>
                  <div style="text-align: center; margin: 25px 0;">
                    <div style="display: inline-block; background-color: #0c1a17; border: 2px dashed #408A71; border-radius: 8px; padding: 15px 40px; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #B0E4CC;">
                      ${otp}
                    </div>
                  </div>
                  <p style="font-size: 12px; color: #ef4444; text-align: center; font-weight: 600; margin-top: 15px;">
                    ⚠️ Do not share this verification code with anyone. Our support team will never ask for it.
                  </p>
                </div>
                <div style="text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1c362c; padding-top: 20px; margin-top: 10px;">
                  <p style="margin: 0 0 8px 0;">This is an automated security message. If you did not request this, please secure your account.</p>
                  <p style="margin: 0;">&copy; 2026 TradeXpert Team. All Rights Reserved.</p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(mailOptions);
          emailSent = true;
        } catch (mailError) {
          console.error("❌ Mail delivery error:", mailError);
        }
      }
    }

    // Print styled console box for developers (guaranteed fallback)
    console.log(`
┌────────────────────────────────────────────────────────┐
│             🔑  TRADEXPERT OTP VERIFICATION            │
├────────────────────────────────────────────────────────┤
│  Recipient:  ${user.email.padEnd(41)} │
│  OTP Code:   ${otp.padEnd(41)} │
│  Expires:    10 Minutes                                │
├────────────────────────────────────────────────────────┤
│  Mail Sent:  ${(emailSent ? "YES (Nodemailer)" : "NO (Console Fallback)").padEnd(41)} │
└────────────────────────────────────────────────────────┘
    `);

    res.status(200).json({ 
      success: true, 
      message: emailSent 
        ? "OTP sent successfully to your registered email!" 
        : "OTP generated successfully! Check server console logs." 
    });
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

    if (!user.resetOtp) {
      return res.status(400).json({ message: "No active verification code request found. Please request a new OTP." });
    }

    // Check expiry
    if (new Date() > user.resetOtpExpires) {
      user.resetOtp = null;
      user.resetOtpExpires = null;
      user.resetOtpAttempts = 0;
      await user.save();
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    // Verify OTP code and check brute force attempts
    if (user.resetOtp !== otp) {
      user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
      await user.save();

      const maxAttempts = 5;
      const attemptsRemaining = maxAttempts - user.resetOtpAttempts;

      if (attemptsRemaining <= 0) {
        user.resetOtp = null;
        user.resetOtpExpires = null;
        user.resetOtpAttempts = 0;
        await user.save();
        return res.status(400).json({ message: "Too many failed attempts. This OTP has been invalidated. Please request a new one." });
      }

      return res.status(400).json({ message: `Invalid verification code. ${attemptsRemaining} attempts remaining.` });
    }

    // Create a temporary JWT signed token indicating OTP has been verified
    const resetToken = jwt.sign(
      { id: user._id, emailOrPhone, resetVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Clean up OTP from DB immediately to prevent replay attacks
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified successfully", resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET FORGOTTEN PASSWORD
const resetForgottenPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    // Verify reset session JWT
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Your reset session has expired or is invalid. Please request a new OTP." });
    }

    if (!decoded || !decoded.resetVerified || !decoded.id) {
      return res.status(400).json({ message: "Invalid reset session token." });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash & save the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear any leftover OTP fields
    user.resetOtp = null;
    user.resetOtpExpires = null;
    user.resetOtpAttempts = 0;
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

// Test SMTP Connection on load to verify configurations
if (nodemailer) {
  const isSmtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_USER !== "your_email@gmail.com" &&
    process.env.SMTP_PASS &&
    process.env.SMTP_PASS !== "your_gmail_app_password";

  if (isSmtpConfigured) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ [SMTP ERROR] SMTP connection verification failed:", error.message);
      } else {
        console.log("✅ [SMTP SUCCESS] SMTP server is online and ready to send emails.");
      }
    });
  } else {
    console.log("ℹ️ [OTP SYSTEM] SMTP is not configured (using placeholders). Falling back to local console logging.");
  }
}