const Trade = require("../models/Trade.cjs");

// PLACE TRADE

const placeTrade = async (

  req,

  res

) => {

  try {

    const {

      symbol,

      type,

      quantity,

      price,

    } = req.body;

    const total =

      quantity * price;

    const trade = await Trade.create({

      userId: req.user.id,

      symbol,

      type,

      quantity,

      price,

      total,

    });

    res.status(201).json({

      success: true,

      trade,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// GET USER TRADES

const getTrades = async (

  req,

  res

) => {

  try {

    const trades = await Trade.find({

      userId: req.user.id,

    }).sort({

      createdAt: -1,

    });

    res.status(200).json({

      success: true,

      trades,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

module.exports = {

  placeTrade,

  getTrades,

};