import express from "express";

import axios from "axios";

const router =
  express.Router();

// LOGIN URL

router.get(
  "/login",
  (req, res) => {

    const authUrl =

      `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${process.env.UPSTOX_API_KEY}&redirect_uri=${process.env.UPSTOX_REDIRECT_URI}`;

    res.redirect(authUrl);

  }
);

// CALLBACK

router.get(
  "/callback",
  async (req, res) => {

    try {

      const code =
        req.query.code;

      // TOKEN EXCHANGE

      const response =
        await axios.post(

          "https://api.upstox.com/v2/login/authorization/token",

          {

            code,

            client_id:
              process.env.UPSTOX_API_KEY,

            client_secret:
              process.env.UPSTOX_API_SECRET,

            redirect_uri:
              process.env.UPSTOX_REDIRECT_URI,

            grant_type:
              "authorization_code",

          },

          {

            headers: {

              accept:
                "application/json",

              "Content-Type":
                "application/x-www-form-urlencoded",

            },

          }
        );

      const accessToken =

        response.data
          .access_token;

      console.log(
        "✅ ACCESS TOKEN:",
        accessToken
      );

      res.send(

        `
          <h1>Upstox Connected Successfully 🚀</h1>

          <p>Copy this token:</p>

          <textarea rows="10" cols="80">${accessToken}</textarea>
        `
      );

    } catch (error) {

      console.log(
        error.response?.data ||
          error.message
      );

      res.send(
        "OAuth Failed"
      );

    }

  }
);

export default router;