const Order = require(
  "../models/orderModel.cjs"
);

const Holding = require(
  "../models/holdingModel.cjs"
);

const User = require(
  "../models/User.cjs"
);

// PLACE ORDER

exports.placeOrder =
  async (req, res) => {

    try {

      const {

        symbol,
        type,
        quantity,
        price,
        exchange,
        priceMode,

      } = req.body;

      // VALIDATION

      if (
        !symbol ||
        !type ||
        !quantity ||
        !price
      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }

      // WALLET BALANCE & HOLDINGS VALIDATION
      const userDoc = await User.findById(req.user.id);
      if (!userDoc) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const cost = Number(price) * Number(quantity);
      if (type === "BUY" && (userDoc.balance ?? 1000000) < cost) {
        return res.status(400).json({
          success: false,
          message: `Insufficient funds! Required: ₹${cost.toFixed(2)}, Available: ₹${(userDoc.balance ?? 1000000).toFixed(2)}`,
        });
      }

      if (type === "SELL") {
        const holding = await Holding.findOne({ user: req.user.id, symbol });
        if (!holding || holding.quantity < Number(quantity)) {
          return res.status(400).json({
            success: false,
            message: `Insufficient holdings! You only own ${holding?.quantity || 0} shares of ${symbol}.`,
          });
        }
      }

      const normalizedPriceMode = priceMode ? priceMode.toUpperCase() : "MARKET";
      const normalizedExchange = exchange ? exchange.toUpperCase() : "NSE";

      // CREATE ORDER

      const order =
        await Order.create({

          user: req.user.id,

          symbol: symbol.toUpperCase(),

          type,

          quantity,

          price,

          exchange: normalizedExchange,

          priceMode: normalizedPriceMode,

          status: "PENDING",

        });

      // SIMULATE EXECUTION FOR MARKET ORDERS

      if (normalizedPriceMode === "MARKET") {
        setTimeout(async () => {
          try {
            const freshOrder = await Order.findById(order._id);
            if (freshOrder && freshOrder.status === "PENDING") {
              const io = req.app.get("io");
              const { executeOrder } = require("../services/orderExecutionService.cjs");
              await executeOrder(freshOrder, price, io);
            }
          } catch (error) {
            console.error("Market Order Execution Error:", error.message);
          }
        }, 2000);
      }

      // RESPONSE

      res.status(201).json({

        success: true,

        message:
          normalizedPriceMode === "LIMIT"
            ? `Limit order placed successfully at ₹${Number(price).toFixed(2)}`
            : "Order placed successfully",

        order,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

// GET ORDERS

exports.getOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({

          user: req.user.id,

        }).sort({

          createdAt: -1,

        });

      res.status(200).json({

        success: true,

        orders,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };