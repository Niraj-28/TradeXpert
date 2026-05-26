const Portfolio = require("../models/Portfolio");

const Transaction = require("../models/Transaction");


// BUY STOCK

const buyStock = async (req, res) => {

  try {

    const {

      stockSymbol,
      stockName,
      quantity,
      price,

    } = req.body;

    const userId = req.user.id;

    const total = quantity * price;

    let portfolio =

      await Portfolio.findOne({

        userId,
        stockSymbol,

      });

    if (portfolio) {

      portfolio.quantity += quantity;

      portfolio.investedAmount += total;

      portfolio.averagePrice =

        portfolio.investedAmount /

        portfolio.quantity;

      await portfolio.save();

    } else {

      portfolio = await Portfolio.create({

        userId,

        stockSymbol,

        stockName,

        quantity,

        averagePrice: price,

        investedAmount: total,

      });

    }

    await Transaction.create({

      userId,

      stockSymbol,

      stockName,

      type: "BUY",

      quantity,

      price,

      total,

    });

    res.status(200).json({

      message: "Stock Bought",

      portfolio,

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};


// SELL STOCK

const sellStock = async (req, res) => {

  try {

    const {

      stockSymbol,
      quantity,
      price,

    } = req.body;

    const userId = req.user.id;

    const portfolio =

      await Portfolio.findOne({

        userId,
        stockSymbol,

      });

    if (!portfolio) {

      return res.status(400).json({

        message: "Stock not found",

      });

    }

    if (portfolio.quantity < quantity) {

      return res.status(400).json({

        message: "Insufficient quantity",

      });

    }

    portfolio.quantity -= quantity;

    portfolio.investedAmount -=

      quantity * portfolio.averagePrice;

    await portfolio.save();

    await Transaction.create({

      userId,

      stockSymbol,

      stockName: portfolio.stockName,

      type: "SELL",

      quantity,

      price,

      total: quantity * price,

    });

    res.status(200).json({

      message: "Stock Sold",

    });

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};


// GET PORTFOLIO

const getPortfolio = async (req, res) => {

  try {

    const portfolio =

      await Portfolio.find({

        userId: req.user.id,

      });

    res.status(200).json(portfolio);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};


// GET TRANSACTIONS

const getTransactions = async (req, res) => {

  try {

    const transactions =

      await Transaction.find({

        userId: req.user.id,

      }).sort({

        createdAt: -1,

      });

    res.status(200).json(transactions);

  } catch (error) {

    res.status(500).json({

      message: error.message,

    });

  }

};

module.exports = {

  buyStock,
  sellStock,
  getPortfolio,
  getTransactions,

};