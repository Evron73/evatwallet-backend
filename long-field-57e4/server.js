import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import fetch from "node-fetch";

const app = express();
const server = http.createServer(app);

// ✅ Engedélyezzük a Cloudflare frontend hozzáférést
app.use(
  cors({
    origin: [
      "https://77463536.evatwallet.pages.dev",
      "https://evatwallet.pages.dev"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Socket.io konfigurálása CORS-szal
const io = new Server(server, {
  cors: {
    origin: [
      "https://77463536.evatwallet.pages.dev",
      "https://evatwallet.pages.dev"
    ],
    methods: ["GET", "POST"],
  },
});

// Dummy felhasználói adatok tárolása (DEMO)
let users = {};

io.on("connection", (socket) => {
  console.log("✅ Új kliens csatlakozott:", socket.id);

  // Felhasználó belépése sandboxba
  socket.on("join", (username) => {
    if (!users[username]) {
      users[username] = {
        btc: 1,
        eth: 1,
      };
    }
    socket.emit("walletData", users[username]);
  });

  // Árfolyam frissítés 30 másodpercenként
  const fetchPrices = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      );
      const data = await response.json();

      io.emit("priceUpdate", {
        btc: data.bitcoin.usd,
        eth: data.ethereum.usd,
      });
    } catch (err) {
      console.error("⚠️ Hiba az árfolyam lekérésénél:", err.message);
    }
  };

  // ✅ Árfolyam frissítés ritkán (30–60 másodperc)
  setTimeout(fetchPrices, 3000);
  setInterval(fetchPrices, 30000 + Math.random() * 30000);
});

app.get("/", (req, res) => {
  res.send("✅ EVAT Wallet backend fut rendben!");
});

// Render alapértelmezett port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 EVAT Wallet backend fut: http://localhost:${PORT}`);
});
