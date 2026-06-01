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

      // CREATE ORDER

      const order =
        await Order.create({

          user: req.user.id,

          symbol,

          type,

          quantity,

          price,

          status: "PENDING",

        });

      // SIMULATE EXECUTION

      setTimeout(async () => {

        try {

          // EXECUTE ORDER

          order.status =
            "EXECUTED";

          order.executedAt =
            new Date();

          await order.save();

          // FIND HOLDING

          let holding =
            await Holding.findOne({

              user: req.user.id,

              symbol,

            });

          const user = await User.findById(req.user.id);
          const execCost = Number(price) * Number(quantity);

          // BUY ORDER

          if (type === "BUY") {

            if (holding) {

              // UPDATE EXISTING HOLDING

              const totalQty =

                holding.quantity +
                Number(quantity);

              const totalCost =

                holding.avgPrice *
                  holding.quantity +
                execCost;

              holding.quantity =
                totalQty;

              holding.avgPrice =
                totalCost /
                totalQty;

              await holding.save();

            } else {

              // CREATE NEW HOLDING

              await Holding.create({

                user: req.user.id,

                symbol,

                quantity:
                  Number(quantity),

                avgPrice:
                  Number(price),

              });

            }

            if (user) {
              user.balance = Math.max(0, (user.balance ?? 1000000) - execCost);
              await user.save();
            }

          }

          // SELL ORDER

          if (type === "SELL") {

            if (holding) {

              holding.quantity -=
                Number(quantity);

              // REMOVE HOLDING IF ZERO

              if (
                holding.quantity <=
                0
              ) {

                await Holding.findByIdAndDelete(

                  holding._id

                );

              } else {

                await holding.save();

              }

            }

            if (user) {
              user.balance = (user.balance ?? 1000000) + execCost;
              await user.save();
            }

          }

        } catch (error) {

          console.log(

            "Execution Error:",

            error.message

          );

        }

      }, 2000);

      // RESPONSE

      res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

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