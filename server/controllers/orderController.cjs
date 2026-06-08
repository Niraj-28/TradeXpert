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
        productType,

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

      const normalizedProductType = productType ? productType.toUpperCase() : "DELIVERY";
      const normalizedPriceMode = priceMode ? priceMode.toUpperCase() : "MARKET";
      const normalizedExchange = exchange ? exchange.toUpperCase() : "NSE";

      // WALLET BALANCE & HOLDINGS VALIDATION
      const userDoc = await User.findById(req.user.id);
      if (!userDoc) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const cost = Number(price) * Number(quantity);

      if (normalizedProductType === "INTRADAY") {
        // Intraday margin requires only 20% (5x leverage)
        const currentHolding = await Holding.findOne({ user: req.user.id, symbol: symbol.toUpperCase(), productType: "INTRADAY" });

        if (type === "BUY") {
          // If the user has a short position (holding.quantity < 0), buying squares it off first
          let sqQty = 0;
          if (currentHolding && currentHolding.quantity < 0) {
            sqQty = Math.min(Number(quantity), Math.abs(currentHolding.quantity));
          }
          const excessQty = Math.max(0, Number(quantity) - sqQty);
          const requiredMarginForBuy = (excessQty * Number(price)) / 5;

          if ((userDoc.balance ?? 1000000) < requiredMarginForBuy) {
            return res.status(400).json({
              success: false,
              message: `Insufficient funds! Required Intraday Margin: ₹${requiredMarginForBuy.toFixed(2)}, Available: ₹${(userDoc.balance ?? 1000000).toFixed(2)}`,
            });
          }
        } else if (type === "SELL") {
          // If the user has a long position (holding.quantity > 0), selling squares it off first
          let sqQty = 0;
          if (currentHolding && currentHolding.quantity > 0) {
            sqQty = Math.min(Number(quantity), currentHolding.quantity);
          }
          const excessQty = Math.max(0, Number(quantity) - sqQty);
          const requiredMarginForShort = (excessQty * Number(price)) / 5;

          if ((userDoc.balance ?? 1000000) < requiredMarginForShort) {
            return res.status(400).json({
              success: false,
              message: `Insufficient funds! Required Intraday Short Margin: ₹${requiredMarginForShort.toFixed(2)}, Available: ₹${(userDoc.balance ?? 1000000).toFixed(2)}`,
            });
          }
        }
      } else {
        // DELIVERY - CNC
        if (type === "BUY" && (userDoc.balance ?? 1000000) < cost) {
          return res.status(400).json({
            success: false,
            message: `Insufficient funds! Required: ₹${cost.toFixed(2)}, Available: ₹${(userDoc.balance ?? 1000000).toFixed(2)}`,
          });
        }

        if (type === "SELL") {
          const holding = await Holding.findOne({ user: req.user.id, symbol: symbol.toUpperCase(), productType: "DELIVERY" });
          if (!holding || holding.quantity < Number(quantity)) {
            return res.status(400).json({
              success: false,
              message: `Insufficient holdings! You only own ${holding?.quantity || 0} shares of ${symbol} (Delivery).`,
            });
          }
        }
      }

      // CHECK MARKET HOURS (9:15 AM TO 3:30 PM IST, MONDAY TO FRIDAY)
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        weekday: "long",
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const hours = parseInt(parts.find(p => p.type === 'hour').value, 10);
      const minutes = parseInt(parts.find(p => p.type === 'minute').value, 10);
      const weekday = parts.find(p => p.type === 'weekday').value;

      const totalMinutes = hours * 60 + minutes;
      const startMinutes = 9 * 60 + 15; // 9:15 AM
      const endMinutes = 15 * 60 + 30; // 3:30 PM

      const isWeekend = weekday === "Saturday" || weekday === "Sunday";
      const isMarketHours = !isWeekend && totalMinutes >= startMinutes && totalMinutes < endMinutes;

      const orderStatus = isMarketHours ? "PENDING" : "CANCELLED";

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

          productType: normalizedProductType,

          status: orderStatus,

        });

      // SIMULATE EXECUTION FOR MARKET ORDERS

      if (normalizedPriceMode === "MARKET" && orderStatus === "PENDING") {
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

      let successMessage = "";
      if (orderStatus === "CANCELLED") {
        successMessage = "Order cancelled: Market is closed (Trading hours: 9:15 AM to 3:30 PM IST)";
      } else {
        successMessage = normalizedPriceMode === "LIMIT"
          ? `Limit order placed successfully at ₹${Number(price).toFixed(2)}`
          : "Order placed successfully";
      }

      res.status(201).json({

        success: true,

        message: successMessage,

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

      const { cancelStalePendingOrders } = require("../services/orderExecutionService.cjs");
      await cancelStalePendingOrders(req.user.id);

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

exports.autoSquareOffAllUsers =
  async (req, res) => {

    try {

      const io = req.app.get("io");
      const { autoSquareOffIntraday } = require("../services/orderExecutionService.cjs");
      const count = await autoSquareOffIntraday(io);

      res.status(200).json({

        success: true,

        message: `Auto square-off completed. Squared off ${count} intraday positions.`,

        count,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };