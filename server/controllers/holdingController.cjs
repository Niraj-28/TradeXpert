const Holding = require(
  "../models/holdingModel.cjs"
);

exports.getHoldings =
  async (req, res) => {

    try {

      const holdings =
        await Holding.find({

          user: req.user.id,

        });

      res.status(200).json({

        success: true,

        holdings,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };