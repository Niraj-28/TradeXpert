const express = require("express");

const axios = require("axios");

const qs = require("qs");

const router = express.Router();


// STEP 1
// LOGIN URL

router.get("/login", (req, res) => {

  const authUrl =

    `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${process.env.UPSTOX_REDIRECT_URI}`;

  res.redirect(authUrl);

});


// STEP 2
// CALLBACK

router.get("/callback", async (req, res) => {

  try {

    const code = req.query.code;


    const response = await axios.post(

      "https://api.upstox.com/v2/login/authorization/token",

      qs.stringify({

        code,

        client_id:
          process.env.UPSTOX_API_KEY,

        client_secret:
          process.env.UPSTOX_API_SECRET,

        redirect_uri:
          process.env.UPSTOX_REDIRECT_URI,

        grant_type:
          "authorization_code",

      }),

      {

        headers: {

          "Content-Type":
            "application/x-www-form-urlencoded",

        },

      }

    );


    const accessToken =
      response.data.access_token;


    global.upstoxToken =
      accessToken;


    res.send(

      "Upstox Connected Successfully"

    );

  } catch (error) {

    console.log(error.response?.data);

    res.status(500).send(
      "Authentication Failed"
    );

  }

});


// STEP 3
// GET MARKET QUOTE

router.get("/market/:symbol", async (req, res) => {

  try {

    const symbol = req.params.symbol;


    const response = await axios.get(

      `https://api.upstox.com/v2/market-quote/quotes?instrument_key=${symbol}`,

      {

        headers: {

          Authorization:
            `Bearer ${global.upstoxToken}`,

        },

      }

    );


    res.json(response.data);

  } catch (error) {

    console.log(error.response?.data);

    res.status(500).json({

      message: "Market Data Error",

    });

  }

});


module.exports = router;