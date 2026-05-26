const express = require("express");

const axios = require("axios");

const router = express.Router();

router.get("/callback", async (req, res) => {

  try {

    const code = req.query.code;

    console.log("AUTH CODE:", code);

    const response = await axios.post(

      "https://api.upstox.com/v2/login/authorization/token",

      new URLSearchParams({

        code,

        client_id: process.env.UPSTOX_API_KEY,

        client_secret: process.env.UPSTOX_API_SECRET,

        redirect_uri: process.env.UPSTOX_REDIRECT_URI,

        grant_type: "authorization_code",

      }),

      {

        headers: {

          accept: "application/json",

          "Api-Version": "2.0",

          "Content-Type":

            "application/x-www-form-urlencoded",

        },

      }

    );

    console.log(

      "ACCESS TOKEN:\n",

      response.data.access_token

    );

    res.send(

      "Upstox Connected Successfully"

    );

  } catch (error) {

    console.log(

      error.response?.data ||

      error.message

    );

    res.send(

      "Authentication Failed"

    );

  }

});

module.exports = router;