const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({

  userId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

  },

  stockSymbol: String,

  stockName: String,

  quantity: Number,

  averagePrice: Number,

  investedAmount: Number,

}, {

  timestamps: true,

});

module.exports = mongoose.model(
  "Portfolio",
  portfolioSchema
);