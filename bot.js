// backend/bot.js
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

// 🔹 Telegram BotFather token
const TOKEN = "8294024160:AAH9Bv-AIp9l8radm7VgBGkgqepgHi_ZYK8";

// 🔹 Cloudflare Pages URL (amit most használsz)
const WEBAPP_URL = "https://evatwallet.pages.dev";

const bot = new TelegramBot(TOKEN, { polling: true });

// 🔹 users.json elérési út
const usersFile = path.join(__dirname, "users.json");

// --- Segédfüggvények ---
const loadUsers = () => {
  if (!fs.existsSync(usersFile)) return {};
  return JSON.parse(fs.readFileSync(usersFile, "utf8"));
};

const saveUsers = (data) => {
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
};

const initUser = (chatId, name) => {
  const users = loadUsers();
  if (!users[chatId]) {
    users[chatId] = {
      name: name || "Trader",
      usd: 1000,
      btc: 1,
      eth: 1,
      created_at: new Date().toISOString(),
    };
    saveUsers(users);
  }
  return users[chatId];
};

// --- /start parancs ---
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || "kereskedő";
  const user = initUser(chatId, name);

  const message = `👋 Üdv, *${name}!*
Ez itt az **EVAT Wallet Mini-App** 💰  
Virtuális kereskedés BTC / ETH tokenekkel.

💼 *Egyenleged:*
- USD: ${user.usd.toFixed(2)}
- BTC: ${user.btc.toFixed(4)}
- ETH: ${user.eth.toFixed(4)}

Nyisd meg a walletet a Telegramon belül:👇`;

  bot.sendMessage(chatId, message, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "💳 Megnyitás – EVAT Wallet",
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

console.log("🤖 EVAT Wallet Bot elindult...");
