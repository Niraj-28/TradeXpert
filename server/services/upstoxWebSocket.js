import axios from "axios";

import WebSocket from "ws";

import path from "path";
import { fileURLToPath } from "url";

import protobuf from "protobufjs";

let ws = null;

export const connectUpstoxWebSocket =
  async ({
    io,
    accessToken,
  }) => {

    try {

      // LOAD PROTO

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const protoPath = path.resolve(__dirname, "../proto/MarketDataFeed.proto");

      const root =
        await protobuf.load(protoPath);

      const FeedResponse =
        root.lookupType(
          "com.upstox.marketdatafeeder.rpc.proto.FeedResponse"
        );

      // AUTHORIZED URL

      const response =
        await axios.get(

          "https://api.upstox.com/v3/feed/market-data-feed/authorize",

          {

            headers: {

              Authorization:
                `Bearer ${accessToken}`,

              Accept:
                "application/json",

            },

          }
        );

      const authorizedUrl =
        response.data.data
          .authorized_redirect_uri;

      console.log(
        "✅ Authorized Feed URL Received"
      );

      // CONNECT

      ws = new WebSocket(
        authorizedUrl
      );

      let subscribed = false;

      // OPEN

      ws.on(
        "open",
        () => {

          console.log(
            "✅ Upstox WebSocket Connected"
          );

        }
      );

      // MESSAGE

     ws.on(
    "message",
    (buffer) => {

        try {

        console.log(
            "📦 RAW BUFFER RECEIVED"
        );

        const decoded =

            FeedResponse.decode(
            new Uint8Array(
                buffer
            )
            );

        console.log(
            "📦 DECODED:",
            JSON.stringify(
            decoded,
            null,
            2
            )
        );

        const object =

            FeedResponse.toObject(
            decoded,
            {
                longs: String,
                enums: String,
                defaults: true,
            }
            );

        console.log(
            "📦 OBJECT:",
            JSON.stringify(
            object,
            null,
            2
            )
        );

        } catch (err) {

        console.log(
            "WS Decode Error:",
            err.message
        );

        }

    }
    );
      // ERROR

      ws.on(
        "error",
        (err) => {

          console.log(
            "WS Error:",
            err.message
          );

        }
      );

      // CLOSE

      ws.on(
        "close",
        () => {

          console.log(
            "❌ Upstox WebSocket Closed"
          );

        }
      );

    } catch (error) {

      console.log(

        "Upstox Connection Error:",

        error.response?.data ||
          error.message

      );

    }

  };