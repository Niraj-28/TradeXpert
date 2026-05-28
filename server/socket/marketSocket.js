import axios from "axios";

const indices = [

  {
    name: "NIFTY 50",
    symbol: "NSE_INDEX|Nifty 50",
  },

  {
    name: "SENSEX",
    symbol: "BSE_INDEX|SENSEX",
  },

  {
    name: "BANKNIFTY",
    symbol: "NSE_INDEX|Nifty Bank",
  },

];

export const initializeMarketSocket =
  (io) => {

    setInterval(
      async () => {

        try {

          // DEMO STOCKS
          const marketData = [

            // NIFTY 50

            {
              symbol: "RELIANCE",
              price: (
                2900 +
                Math.random() * 50
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "TCS",
              price: (
                4100 +
                Math.random() * 50
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "INFY",
              price: (
                1600 +
                Math.random() * 30
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "HDFCBANK",
              price: (
                1750 +
                Math.random() * 40
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "ICICIBANK",
              price: (
                1180 +
                Math.random() * 25
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "SBIN",
              price: (
                890 +
                Math.random() * 20
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "AXISBANK",
              price: (
                1220 +
                Math.random() * 25
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "KOTAKBANK",
              price: (
                1820 +
                Math.random() * 30
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            // IT

            {
              symbol: "WIPRO",
              price: (
                560 +
                Math.random() * 15
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "HCLTECH",
              price: (
                1420 +
                Math.random() * 30
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "TECHM",
              price: (
                1580 +
                Math.random() * 25
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            // AUTO

            {
              symbol: "TATAMOTORS",
              price: (
                980 +
                Math.random() * 20
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "MARUTI",
              price: (
                12800 +
                Math.random() * 80
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "M&M",
              price: (
                2920 +
                Math.random() * 40
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            // FMCG

            {
              symbol: "HINDUNILVR",
              price: (
                2580 +
                Math.random() * 35
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "ITC",
              price: (
                470 +
                Math.random() * 10
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            // PHARMA

            {
              symbol: "SUNPHARMA",
              price: (
                1680 +
                Math.random() * 25
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

            {
              symbol: "DRREDDY",
              price: (
                6450 +
                Math.random() * 60
              ).toFixed(2),
              change: (
                Math.random() * 4 - 2
              ).toFixed(2),
            },

          ];

          // LIVE INDICES

          const liveIndices =

            indices.map(
              (item) => ({

                name: item.name,

                value: (
                  Math.random() *
                    1000 +
                  24000
                ).toFixed(2),

                change: (
                  Math.random() *
                    2 -
                  1
                ).toFixed(2),

              })
            );

          io.emit(
            "marketData",
            marketData
          );

          io.emit(
            "marketIndices",
            liveIndices
          );

        } catch (error) {

          console.log(
            "Market Socket Error:",
            error.message
          );

        }

      },

      3000

    );

  };