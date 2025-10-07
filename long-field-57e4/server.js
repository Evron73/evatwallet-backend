import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- USERS.JSON útvonal ---
const USERS_FILE = path.join(__dirname, "users.json");

// --- Segédfüggvény: fájl beolvasás ---
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return {};
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

// --- Segédfüggvény: fájl mentés ---
function saveUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

// --- API endpointok ---

// 1️⃣ Összes user lekérése
app.get("/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// 2️⃣ Egy user lekérése ID alapján
app.get("/users/:id", (req, res) => {
  const users = loadUsers();
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// 3️⃣ User frissítése vagy létrehozása
app.post("/users/:id", (req, res) => {
  const users = loadUsers();
  users[req.params.id] = { ...users[req.params.id], ...req.body };
  saveUsers(users);
  res.json({ success: true, data: users[req.params.id] });
});

// 4️⃣ Alap üzenet
app.get("/", (req, res) => {
  res.send("EVAT Wallet Backend működik ✅");
});

// --- Szerver indítása ---
app.listen(PORT, () => {
  console.log(`✅ EVAT Wallet backend fut: http://localhost:${PORT}`);
});
    