const express = require(
  "express"
);

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {

  placeOrder,
  getOrders,

} = require(
  "../controllers/orderController"
);

router.post(
  "/",
  protect,
  placeOrder
);

router.get(
  "/",
  protect,
  getOrders
);

module.exports =
  router;