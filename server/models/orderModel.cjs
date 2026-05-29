const mongoose = require(
  "mongoose"
);

const orderSchema =
  new mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },

      symbol: {

        type: String,

        required: true,

      },

      type: {

        type: String,

        enum: [

          "BUY",
          "SELL",

        ],

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

      status: {

        type: String,

        enum: [

          "PENDING",
          "EXECUTED",
          "CANCELLED",

        ],

        default: "PENDING",

      },

      executedAt: Date,

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );
  