const express = require("express");

const router = express.Router();

const {

  placeTrade,

  getTrades,

} = require(

  "../controllers/tradeController"

);

const authMiddleware = require(

  "../middleware/authMiddleware"

);

// PLACE TRADE

router.post(

  "/place",

  authMiddleware,

  placeTrade

);

// GET TRADES

router.get(

  "/history",

  authMiddleware,

  getTrades

);

module.exports = router;