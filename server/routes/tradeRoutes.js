const express = require("express");

const router = express.Router();

const tradeController = require(
  "../controllers/tradeController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);


// BUY

router.post(

  "/buy",

  authMiddleware,

  tradeController.buyStock

);


// SELL

router.post(

  "/sell",

  authMiddleware,

  tradeController.sellStock

);


// PORTFOLIO

router.get(

  "/portfolio",

  authMiddleware,

  tradeController.getPortfolio

);


// TRANSACTIONS

router.get(

  "/transactions",

  authMiddleware,

  tradeController.getTransactions

);

module.exports = router;