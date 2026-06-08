const Order = require("../models/orderModel.cjs");
const Holding = require("../models/holdingModel.cjs");
const User = require("../models/User.cjs");

async function executeOrder(order, currentPrice, io) {
  try {
    // 1. Mark order as EXECUTED
    order.status = "EXECUTED";
    order.executedAt = new Date();
    
    // Execute at the order's limit price or the market price at entry
    const execPrice = order.price;
    await order.save();

    // 2. Fetch User and Holding
    const userId = order.user;
    const symbol = order.symbol;
    const quantity = order.quantity;
    const type = order.type;
    const productType = order.productType ? order.productType.toUpperCase() : "DELIVERY";
    const execCost = Number(execPrice) * Number(quantity);

    let holding = await Holding.findOne({ user: userId, symbol, productType });
    const user = await User.findById(userId);

    if (productType === "DELIVERY") {
      // Standard 100% Cash / Delivery logic
      if (type === "BUY") {
        if (holding) {
          const totalQty = holding.quantity + Number(quantity);
          const totalCost = (holding.avgPrice * holding.quantity) + execCost;
          holding.quantity = totalQty;
          holding.avgPrice = totalCost / totalQty;
          await holding.save();
        } else {
          await Holding.create({
            user: userId,
            symbol,
            quantity: Number(quantity),
            avgPrice: Number(execPrice),
            productType: "DELIVERY",
          });
        }

        if (user) {
          user.balance = Math.max(0, (user.balance ?? 1000000) - execCost);
          await user.save();
        }
      } else if (type === "SELL") {
        if (holding) {
          holding.quantity -= Number(quantity);
          if (holding.quantity <= 0) {
            await Holding.findByIdAndDelete(holding._id);
          } else {
            await holding.save();
          }
        }

        if (user) {
          user.balance = (user.balance ?? 1000000) + execCost;
          await user.save();
        }
      }
    } else if (productType === "INTRADAY") {
      // Leveraged 5x Intraday / Short-selling logic
      if (type === "BUY") {
        if (holding && holding.quantity < 0) {
          // Case A: Squaring off an active short position
          const shortQty = Math.abs(holding.quantity);
          const sqQty = Math.min(Number(quantity), shortQty);
          const remQty = Number(quantity) - sqQty;

          // Margin released = (sqQty * avgPrice) / 5
          const marginReleased = (sqQty * holding.avgPrice) / 5;
          // P&L for short = sqQty * (avgPrice - execPrice)
          const pnl = sqQty * (holding.avgPrice - Number(execPrice));

          if (user) {
            user.balance = (user.balance ?? 1000000) + marginReleased + pnl;
            await user.save();
          }

          holding.quantity += sqQty;
          if (holding.quantity === 0) {
            await Holding.findByIdAndDelete(holding._id);
          } else {
            await holding.save();
          }

          // If there's leftover buy quantity, open a new long position
          if (remQty > 0) {
            const marginDeducted = (remQty * Number(execPrice)) / 5;
            if (user) {
              user.balance = Math.max(0, (user.balance ?? 1000000) - marginDeducted);
              await user.save();
            }
            await Holding.create({
              user: userId,
              symbol,
              quantity: remQty,
              avgPrice: Number(execPrice),
              productType: "INTRADAY",
            });
          }
        } else {
          // Case B: No active short position. Standard buy to open/increase long position.
          const marginDeducted = (Number(quantity) * Number(execPrice)) / 5;
          if (user) {
            user.balance = Math.max(0, (user.balance ?? 1000000) - marginDeducted);
            await user.save();
          }

          if (holding) {
            const totalQty = holding.quantity + Number(quantity);
            const totalCost = (holding.avgPrice * holding.quantity) + (Number(quantity) * Number(execPrice));
            holding.quantity = totalQty;
            holding.avgPrice = totalCost / totalQty;
            await holding.save();
          } else {
            await Holding.create({
              user: userId,
              symbol,
              quantity: Number(quantity),
              avgPrice: Number(execPrice),
              productType: "INTRADAY",
            });
          }
        }
      } else if (type === "SELL") {
        if (holding && holding.quantity > 0) {
          // Case C: Squaring off an active long position
          const longQty = holding.quantity;
          const sqQty = Math.min(Number(quantity), longQty);
          const remQty = Number(quantity) - sqQty;

          // Margin released = (sqQty * avgPrice) / 5
          const marginReleased = (sqQty * holding.avgPrice) / 5;
          // P&L for long = sqQty * (execPrice - avgPrice)
          const pnl = sqQty * (Number(execPrice) - holding.avgPrice);

          if (user) {
            user.balance = (user.balance ?? 1000000) + marginReleased + pnl;
            await user.save();
          }

          holding.quantity -= sqQty;
          if (holding.quantity === 0) {
            await Holding.findByIdAndDelete(holding._id);
          } else {
            await holding.save();
          }

          // If there's leftover sell quantity, open a new short position (short sell)
          if (remQty > 0) {
            const marginDeducted = (remQty * Number(execPrice)) / 5;
            if (user) {
              user.balance = Math.max(0, (user.balance ?? 1000000) - marginDeducted);
              await user.save();
            }
            await Holding.create({
              user: userId,
              symbol,
              quantity: -remQty,
              avgPrice: Number(execPrice),
              productType: "INTRADAY",
            });
          }
        } else {
          // Case D: No active long position. Standard short-selling to open/increase short position.
          const marginDeducted = (Number(quantity) * Number(execPrice)) / 5;
          if (user) {
            user.balance = Math.max(0, (user.balance ?? 1000000) - marginDeducted);
            await user.save();
          }

          if (holding) {
            const currentAbsQty = Math.abs(holding.quantity);
            const totalQty = currentAbsQty + Number(quantity);
            const totalCost = (holding.avgPrice * currentAbsQty) + (Number(quantity) * Number(execPrice));
            holding.quantity = -totalQty;
            holding.avgPrice = totalCost / totalQty;
            await holding.save();
          } else {
            await Holding.create({
              user: userId,
              symbol,
              quantity: -Number(quantity),
              avgPrice: Number(execPrice),
              productType: "INTRADAY",
            });
          }
        }
      }
    }

    // 3. Emit socket event to the user room
    if (io) {
      const room = userId.toString();
      io.to(room).emit("order-executed", {
        id: order._id.toString(),
        symbol,
        type,
        quantity,
        price: execPrice,
        productType,
        message: `Order Executed: ${type} ${quantity} shares of ${symbol} at ₹${Number(execPrice).toFixed(2)} (${order.exchange}) [${productType}]`,
        time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      });
    }

    console.log(`🎯 [ORDER EXECUTED] ${type} ${quantity} ${symbol} at ₹${execPrice} (${order.exchange}) [${productType}] for User ${userId}`);
    return true;
  } catch (error) {
    console.error(`❌ [EXECUTION ERROR] Failed to execute order ${order._id}:`, error.message);
    return false;
  }
}

async function cancelStalePendingOrders(userId = null) {
  try {
    const now = new Date();
    // Get the current date and time in Asia/Kolkata
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      weekday: "long",
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const year = parseInt(parts.find(p => p.type === 'year').value, 10);
    const month = parseInt(parts.find(p => p.type === 'month').value, 10);
    const day = parseInt(parts.find(p => p.type === 'day').value, 10);
    const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
    const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);
    const weekday = parts.find(p => p.type === 'weekday').value;

    const totalMinutes = hour * 60 + minute;
    const startMinutes = 9 * 60 + 15; // 9:15 AM
    const endMinutes = 15 * 60 + 30; // 3:30 PM

    const isWeekend = weekday === "Saturday" || weekday === "Sunday";
    const isMarketOpen = !isWeekend && totalMinutes >= startMinutes && totalMinutes < endMinutes;

    // Start of today in Asia/Kolkata represented as a UTC Date
    const startOfTodayIST = new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - 5.5 * 60 * 60 * 1000);

    let query = {
      status: "PENDING",
    };

    if (isMarketOpen) {
      // If market is currently open, cancel only orders from previous days
      query.createdAt = { $lt: startOfTodayIST };
    } else {
      // If market is closed (weekend, before 9:15 AM, or after 3:30 PM), cancel ALL pending orders
    }

    if (userId) {
      query.user = userId;
    }

    const result = await Order.updateMany(query, { $set: { status: "CANCELLED" } });
    if (result.modifiedCount > 0) {
      console.log(`🧹 [CLEANUP] Cancelled ${result.modifiedCount} stale pending orders (Market Open: ${isMarketOpen}).`);
    }
  } catch (error) {
    console.error("❌ [CLEANUP ERROR] Failed to cancel stale pending orders:", error.message);
  }
}

async function checkPendingLimitOrders(symbol, currentPrice, io) {
  try {
    // Proactively cancel any stale pending orders before checking execution
    await cancelStalePendingOrders();

    const pendingOrders = await Order.find({
      symbol: symbol.toUpperCase(),
      status: "PENDING",
      priceMode: "LIMIT",
    });

    for (const order of pendingOrders) {
      let shouldExecute = false;

      if (order.type === "BUY" && currentPrice <= order.price) {
        shouldExecute = true;
      } else if (order.type === "SELL" && currentPrice >= order.price) {
        shouldExecute = true;
      }

      if (shouldExecute) {
        await executeOrder(order, currentPrice, io);
      }
    }
  } catch (error) {
    console.error(`❌ [LIMIT CHECK ERROR] Failed to check limit orders for ${symbol}:`, error.message);
  }
}

async function autoSquareOffIntraday(io) {
  try {
    const Holding = require("../models/holdingModel.cjs");
    const Order = require("../models/orderModel.cjs");
    const priceCache = require("./priceCache.cjs");

    const intradayHoldings = await Holding.find({ productType: "INTRADAY" });
    if (intradayHoldings.length === 0) return 0;

    console.log(`🤖 [AUTO SQUARE-OFF] Squaring off ${intradayHoldings.length} intraday positions...`);

    let count = 0;
    for (const holding of intradayHoldings) {
      if (holding.quantity === 0) continue;

      const currentPrice = priceCache.getPrice(holding.symbol) || holding.avgPrice;
      const type = holding.quantity > 0 ? "SELL" : "BUY";
      const qty = Math.abs(holding.quantity);

      // Create a square-off market order
      const order = await Order.create({
        user: holding.user,
        symbol: holding.symbol,
        type,
        quantity: qty,
        price: currentPrice,
        priceMode: "MARKET",
        productType: "INTRADAY",
        status: "PENDING",
      });

      // Execute immediately
      await executeOrder(order, currentPrice, io);
      count++;
    }
    console.log(`🤖 [AUTO SQUARE-OFF] Squared off ${count} positions successfully.`);
    return count;
  } catch (error) {
    console.error("❌ [AUTO SQUARE-OFF ERROR] Square-off failed:", error.message);
    throw error;
  }
}

async function cancelAllPendingOrders(io) {
  try {
    const pendingOrders = await Order.find({ status: "PENDING" });
    if (pendingOrders.length === 0) return 0;

    console.log(`🧹 [DAILY CANCEL] Cancelling ${pendingOrders.length} active pending orders...`);
    const result = await Order.updateMany(
      { status: "PENDING" },
      { $set: { status: "CANCELLED" } }
    );

    if (io) {
      for (const order of pendingOrders) {
        const room = order.user.toString();
        io.to(room).emit("order-executed", {
          id: order._id.toString(),
          symbol: order.symbol,
          type: order.type,
          quantity: order.quantity,
          price: order.price,
          productType: order.productType,
          status: "CANCELLED",
          message: `Order Cancelled: ${order.type} ${order.quantity} shares of ${order.symbol} at ₹${Number(order.price).toFixed(2)} (${order.exchange}) [${order.productType}] cancelled at market close.`,
          time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
        });
      }
    }
    return result.modifiedCount;
  } catch (error) {
    console.error("❌ [DAILY CANCEL ERROR] Failed to cancel pending orders:", error.message);
    return 0;
  }
}

module.exports = {
  executeOrder,
  checkPendingLimitOrders,
  cancelStalePendingOrders,
  autoSquareOffIntraday,
  cancelAllPendingOrders,
};
