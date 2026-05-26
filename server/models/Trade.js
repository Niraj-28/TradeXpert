const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(

  {

    userId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    symbol: {

      type: String,

      required: true,

    },

    type: {

      type: String,

      enum: ["BUY", "SELL"],

      required: true,

    },

    quantity: {

      type: Number,

      required: true,

    },

    price: {

      type: Number,

      required: true,

    },

    total: {

      type: Number,

      required: true,

    },

  },

  {

    timestamps: true,

  }

);

module.exports = mongoose.model(

  "Trade",

  tradeSchema

);