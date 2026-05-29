const Order = require(
  "../models/orderModel.cjs"
);

const Holding = require(
  "../models/holdingModel.cjs"
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

                Number(price) *
                  Number(quantity);

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