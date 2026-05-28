import axios from "axios";
import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(
  process.cwd(),
  "instruments-cache.json"
);

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// FETCH ALL INSTRUMENTS FROM UPSTOX

export const fetchAllInstruments =
  async (accessToken) => {

    try {

      // CHECK CACHE FIRST

      if (fs.existsSync(CACHE_FILE)) {

        const cacheData = JSON.parse(

          fs.readFileSync(
            CACHE_FILE,
            "utf-8"
          )

        );

        const cacheAge =

          Date.now() -
          cacheData.timestamp;

        if (
          cacheAge <
          CACHE_DURATION
        ) {

          console.log(

            "✅ Using cached instruments"

          );

          return cacheData
            .instruments;

        }

      }

      // FETCH FROM UPSTOX API

      console.log(

        "⬇️  Fetching instruments from Upstox..."

      );

      const response =
        await axios.get(

          "https://api.upstox.com/v2/market/instruments",

          {

            headers: {

              Authorization:

                `Bearer ${accessToken}`,

              Accept:
                "application/json",

            },

          }

        );

      const allInstruments =

        response.data.data ||
        [];

      // FILTER NSE & BSE EQUITY STOCKS

      const nseStocks =
        allInstruments
          .filter(
            (item) =>

              item.exchange ===
                "NSE_EQ" &&
              item.instrument_type ===
                "EQUITY"
          )
          .slice(0, 100); // TOP 100 NSE STOCKS

      const bseStocks =
        allInstruments
          .filter(
            (item) =>

              item.exchange ===
                "BSE_EQ" &&
              item.instrument_type ===
                "EQUITY"
          )
          .slice(0, 50); // TOP 50 BSE STOCKS

      const instruments = [

        ...nseStocks,

        ...bseStocks,

      ];

      // SAVE TO CACHE

      fs.writeFileSync(

        CACHE_FILE,

        JSON.stringify({

          timestamp:
            Date.now(),

          instruments,

        })

      );

      console.log(

        `✅ Fetched ${instruments.length} instruments`

      );

      return instruments;

    } catch (error) {

      console.error(

        "❌ Error fetching instruments:",

        error.message

      );

      // FALLBACK TO CACHE IF AVAILABLE

      if (
        fs.existsSync(
          CACHE_FILE
        )
      ) {

        const cacheData =
          JSON.parse(

            fs.readFileSync(
              CACHE_FILE,
              "utf-8"
            )

          );

        return cacheData
          .instruments;

      }

      return [];

    }

  };
