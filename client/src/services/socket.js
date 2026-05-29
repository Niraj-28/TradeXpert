import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(URL, {
  // allow polling fallback if websocket fails (prevents EIO transport errors)
  // leaving transports undefined lets socket.io negotiate the best transport
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});