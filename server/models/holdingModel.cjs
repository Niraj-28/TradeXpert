const mongoose = require(
  "mongoose"
);

const holdingSchema =
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

      quantity: {

        type: Number,

        required: true,

      },

      avgPrice: {

        type: Number,

        required: true,

      },

      productType: {

        type: String,

        enum: [

          "DELIVERY",

          "INTRADAY",

        ],

        default: "DELIVERY",

      },

    },

    {

      timestamps: true,

    }

  );

module.exports =
  mongoose.model(

    "Holding",

    holdingSchema

  );