const axios = require("axios");

const instruments = [

  {
    name: "RELIANCE",
    key: "NSE_EQ|INE002A01018",
  },

  {
    name: "TCS",
    key: "NSE_EQ|INE467B01029",
  },

  {
    name: "INFY",
    key: "NSE_EQ|INE009A01021",
  },

  {
    name: "HDFCBANK",
    key: "NSE_EQ|INE040A01034",
  },

  {
    name: "ICICIBANK",
    key: "NSE_EQ|INE090A01021",
  },

  {
    name: "SBIN",
    key: "NSE_EQ|INE062A01020",
  },

];

const getLiveMarketData = async () => {

  try {

    const instrumentKeys = instruments
      .map((item) => item.key)
      .join(",");

    const response = await axios.get(

      "https://api.upstox.com/v2/market-quote/quotes",

      {

        headers: {

          Authorization: `Bearer ${process.env.UPSTOX_ACCESS_TOKEN}`,

          Accept: "application/json",

        },

        params: {

          instrument_key: instrumentKeys,

        },

      }

    );

    return response.data.data;

  } catch (error) {

    console.log(

      "UPSTOX ERROR:",

      error.response?.data ||

      error.message

    );

    return null;

  }

};

module.exports = {

  getLiveMarketData,

};