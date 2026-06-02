const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

  userId: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

  },

  stockSymbol: String,

  stockName: String,

  type: String,

  quantity: Number,

  price: Number,

  total: Number,

}, {

  timestamps: true,

});

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);