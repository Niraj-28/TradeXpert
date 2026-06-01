const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  username: {
    type: String,
    default: "",
  },

  bio: {
    type: String,
    default: "FII/DII tracking & quantitative futures virtual trader.",
  },

  balance: {
    type: Number,
    default: 1000000,
  },

  resetOtp: {
    type: String,
    default: null,
  },

  resetOtpExpires: {
    type: Date,
    default: null,
  },

}, {
  timestamps: true,
});


module.exports = mongoose.model(
  "User",
  userSchema
);