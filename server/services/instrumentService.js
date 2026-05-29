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
          // Upstox instruments endpoint version may differ; using v3 here.
          "https://api-v2.upstox.com/v2/market/instruments",



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

      // RETURN ALL NSE & BSE EQUITY STOCKS (no slicing)
      const nseStocks = allInstruments.filter(
        (item) => item.exchange === "NSE_EQ" && item.instrument_type === "EQUITY"
      );

      const bseStocks = allInstruments.filter(
        (item) => item.exchange === "BSE_EQ" && item.instrument_type === "EQUITY"
      );

      const instruments = [...nseStocks, ...bseStocks];

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

  // Search cached or fetched instruments by query (trading symbol, name, isin, instrument_key)
  export const searchInstruments = (query) => {
    try {
      const q = String(query || "").trim().toLowerCase();

      let items = [];

      if (fs.existsSync(CACHE_FILE)) {
        const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
        items = cacheData.instruments || [];
      }

      if (!items.length) return [];

      const results = items.filter((it) => {
        const trading = (it.trading_symbol || it.tradingSymbol || it.tradingSymbol || "").toLowerCase();
        const name = (it.name || it.company_name || it.instrument_name || "").toLowerCase();
        const isin = (it.isin || "").toLowerCase();
        const key = (it.instrument_key || "").toLowerCase();

        return (
          trading.includes(q) ||
          name.includes(q) ||
          isin.includes(q) ||
          key.includes(q)
        );
      });

      return results.slice(0, 100);
    } catch (e) {
      console.error("Search instruments error:", e.message);
      return [];
    }
  };

  };
