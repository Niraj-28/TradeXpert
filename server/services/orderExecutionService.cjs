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
    const execCost = Number(execPrice) * Number(quantity);

    let holding = await Holding.findOne({ user: userId, symbol });
    const user = await User.findById(userId);

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

    // 3. Emit socket event to the user room
    if (io) {
      const room = userId.toString();
      io.to(room).emit("order-executed", {
        id: order._id.toString(),
        symbol,
        type,
        quantity,
        price: execPrice,
        message: `Order Executed: ${type} ${quantity} shares of ${symbol} at ₹${Number(execPrice).toFixed(2)} (${order.exchange})`,
        time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      });
    }

    console.log(`🎯 [ORDER EXECUTED] ${type} ${quantity} ${symbol} at ₹${execPrice} (${order.exchange}) for User ${userId}`);
    return true;
  } catch (error) {
    console.error(`❌ [EXECUTION ERROR] Failed to execute order ${order._id}:`, error.message);
    return false;
  }
}

async function cancelStalePendingOrders(userId = null) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const query = {
      status: "PENDING",
      createdAt: { $lt: startOfToday },
    };

    if (userId) {
      query.user = userId;
    }

    const result = await Order.updateMany(query, { $set: { status: "CANCELLED" } });
    if (result.modifiedCount > 0) {
      console.log(`🧹 [CLEANUP] Cancelled ${result.modifiedCount} stale pending orders created before today.`);
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

module.exports = {
  executeOrder,
  checkPendingLimitOrders,
  cancelStalePendingOrders,
};
