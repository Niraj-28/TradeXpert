const express = require(
  "express"
);

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {

  getHoldings,

} = require(
  "../controllers/holdingController"
);

router.get(
  "/",
  protect,
  getHoldings
);

module.exports =
  router;