const WebSocket = require("ws");

const protobuf = require("protobufjs");

const path = require("path");

const stocksMap = {

  // INDICES

  "NSE_INDEX|Nifty 50":
    "NIFTY 50",

  "BSE_INDEX|SENSEX":
    "SENSEX",

  "NSE_INDEX|Nifty Bank":
    "BANKNIFTY",

  "NSE_INDEX|Nifty Fin Service":
    "FINNIFTY",

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

    try {

      const token =

        process.env.UPSTOX_ACCESS_TOKEN;

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

      const root =
        await protobuf.load(

          path.join(
            __dirname,
            "../proto/MarketDataFeed.proto"
          )
        );

      const FeedResponse =

        root.lookupType(

          "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
        );

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
                    value.ltpc?.ltp || 0;

                  const close =
                    value.ltpc?.cp || 0;

                  const change =
                    close

                      ? (
                          ((ltp -
                            close) /
                            close) *
                          100
                        ).toFixed(2)

                      : 0;

                  return {

                    symbol:
                      stocksMap[key],

                    price:
                      ltp.toFixed(2),

                    change:
                      Number(change),

                    ohlc: {

                      open:
                        close.toFixed(
                          2
                        ),

                      high:
                        (
                          ltp + 10
                        ).toFixed(2),

                      low:
                        (
                          ltp - 10
                        ).toFixed(2),

                      close:
                        close.toFixed(
                          2
                        ),

                    },

                  };

                }

              );

            io.emit(

              "marketData",

              marketData

            );

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

module.exports =

  startUpstoxMarketFeed;