// src/socket.js
import { io } from "socket.io-client";

export const socket = io("https://evatwallet-backend.onrender.com", {
  transports: ["websocket"],
});

export default socket;
