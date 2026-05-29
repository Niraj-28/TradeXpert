const Watchlist = require(
  "../models/watchlistModel.cjs"
);

exports.getWatchlist =
  async (req, res) => {

    try {

      const watchlist =
        await Watchlist.find({

          user: req.user.id,

        });

      res.status(200).json({

        success: true,

        watchlist,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

exports.addToWatchlist =
  async (req, res) => {

    try {

      const { symbol } =
        req.body;

      const exists =
        await Watchlist.findOne({

          user: req.user.id,

          symbol,

        });

      if (exists) {

        return res.status(400).json({

          message:
            "Already in watchlist",

        });

      }

      const item =
        await Watchlist.create({

          user: req.user.id,

          symbol,

        });

      res.status(201).json({

        success: true,

        item,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

exports.removeFromWatchlist =
  async (req, res) => {

    try {

      await Watchlist.findByIdAndDelete(

        req.params.id

      );

      res.status(200).json({

        success: true,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };