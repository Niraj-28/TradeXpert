import axios from "axios";

import WebSocket from "ws";

import protobuf from "protobufjs";

import path from "path";
import { fileURLToPath } from "url";


const stocksMap = {

  // INDICES

  "NSE_INDEX|Nifty 50":
    "NIFTY 50",

  "BSE_INDEX|SENSEX":
    "SENSEX",

  "NSE_INDEX|Nifty Bank":
    "BANK NIFTY",

  "NSE_INDEX|Nifty Fin Service":
    "FIN NIFTY",

  // STOCKS

  "NSE_EQ|INE002A01018":
    "RELIANCE",

  "NSE_EQ|INE467B01029":
    "TCS",

  "NSE_EQ|INE009A01021":
    "INFY",

  "NSE_EQ|INE040A01034":
    "HDFCBANK",

  "NSE_EQ|INE090A01021":
    "ICICIBANK",

  "NSE_EQ|INE062A01020":
    "SBIN",

};

const startUpstoxMarketFeed =
  async (io) => {

    // Prevent server crash when token is missing/invalid
    const token = process.env.UPSTOX_ACCESS_TOKEN;
    if (!token) {
      console.log(
        "⚠️ UPSTOX_ACCESS_TOKEN is missing. Skipping Upstox market feed startup."
      );
      return;
    }

    try {


      // AUTHORIZE

      const response =
        await axios.get(

          "https://api.upstox.com/v3/feed/market-data-feed/authorize",

          {

            headers: {

              Authorization:
                `Bearer ${token}`,

              Accept:
                "application/json",

              "Api-Version":
                "3.0",

            },

          }

        );

      const wsUrl =

        response.data.data
          .authorized_redirect_uri;

      console.log(
        "Upstox Feed Authorized"
      );

      // LOAD PROTO

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const protoPath = path.resolve(__dirname, "../proto/MarketDataFeed.proto");

      const root =
        await protobuf.load(protoPath);

      const FeedResponse =
        root.lookupType(

          "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
        ) || root.lookupType("FeedResponse");

      // CREATE WS

      const ws =
        new WebSocket(wsUrl);

      ws.on("open", () => {

        console.log(
          "Upstox WebSocket Connected"
        );

        // SUBSCRIBE

        ws.send(

          JSON.stringify({

            guid: "tradexpert",

            method: "sub",

            data: {

              mode: "ltpc",

              instrumentKeys:

                Object.keys(

                  stocksMap

                ),

            },

          })

        );

      });

      ws.on(

        "message",

        (buffer) => {

          try {

            const decoded =

              FeedResponse.decode(

                new Uint8Array(
                  buffer
                )
              );

            const object =

              FeedResponse.toObject(

                decoded,

                {

                  longs: String,
                  enums: String,
                  bytes: String,

                }

              );

            const feeds =

              object.feeds || {};

            const marketData =
              Object.entries(
                feeds
              ).map(
                ([key, value]) => {
                  const ltp =
                    value.ltpc?.ltp ?? 0;
                  const close =
                    value.ltpc?.cp ?? 0;
                  const change =
                    close
                      ? (
                          ((ltp -
                            close) /
                            close) *
                          100
                        )
                      : 0;

                  // key coming from Upstox is typically instrument key.
                  // Always resolve known indices/stocks to stable symbols.
                  const symbol =
                    stocksMap[key] ||
                    key.split("|").pop()?.replace(/_/g, " ").trim() ||
                    key;


                  return {
                    symbol,
                    instrumentKey: key,
                    price: Number(ltp),
                    change: Number(change),
                    ohlc: {
                      open: Number(close),
                      high: Number(ltp) + 10,
                      low: Number(ltp) - 10,
                      close: Number(close),
                    },
                  };

                }
              );

            // Emit both legacy + processed events so different UI parts work.
            io.emit(
              "marketData",
              marketData
            );

            // Indices + movers can be derived from marketData by symbol name.
            const indexSymbols = new Set([
              "NIFTY 50",
              "BANK NIFTY",
              "BANKNIFTY",
              "SENSEX",
              "FIN NIFTY",
              "FINNIFTY",
            ]);

            const indicesData = marketData
              .filter((item) => indexSymbols.has(item.symbol))
              .map((item) => ({
                name: item.symbol,
                // client IndicesBar uses value.toFixed(2), so keep it numeric
                value: Number(item.price),
                change: Number(item.change),
              }));

            const stockData = marketData.filter(
              (item) => !indexSymbols.has(item.symbol)
            );

            const trendingData = stockData.slice(0, 6).map((item) => ({
              symbol: item.symbol,
              price: item.price,
              change: Number(item.change),
            }));

            const gainersData = [...stockData]
              .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
              .slice(0, 3)
              .map((item) => ({
                symbol: item.symbol,
                price: item.price,
                change: Number(item.change),
              }));

            const losersData = [...stockData]
              .sort((a, b) => parseFloat(a.change) - parseFloat(b.change))
              .slice(0, 3)
              .map((item) => ({
                symbol: item.symbol,
                price: item.price,
                change: Number(item.change),
              }));

            const companyMap = {
              RELIANCE: "Reliance Industries",
              TCS: "Tata Consultancy Services",
              INFY: "Infosys",
              HDFCBANK: "HDFC Bank",
              ICICIBANK: "ICICI Bank",
              SBIN: "State Bank of India",
            };

            const marketTableData = stockData.map((item) => ({
              symbol: item.symbol,
              company: companyMap[item.symbol] || item.symbol,
              price: item.price,
              change: Number(item.change),
              volume: "—",
            }));

            io.emit("market-indices", indicesData);
            io.emit("trending-stocks", trendingData);
            io.emit("market-table", marketTableData);
            io.emit("top-gainers", gainersData);
            io.emit("top-losers", losersData);
            io.emit("sector-performance", [
              { sector: "IT", change: 1.2 },
              { sector: "BANKING", change: -0.4 },
              { sector: "AUTO", change: 0.8 },
              { sector: "PHARMA", change: 1.5 },
              { sector: "ENERGY", change: -0.2 },
            ]);



          } catch (error) {

            console.log(

              "Decode Error:",
              error.message

            );

          }

        }

      );

      ws.on("close", () => {

        console.log(
          "Upstox Socket Closed"
        );

      });

    } catch (error) {

      console.log(

        "UPSTOX ERROR:",

        error.response?.data ||

          error.message

      );

    }

  };

export default startUpstoxMarketFeed;

