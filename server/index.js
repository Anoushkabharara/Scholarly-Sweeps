import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { usersDb, bookingsDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = (file) => path.join(__dirname, "data", file);

const JWT_SECRET = process.env.JWT_SECRET || "scholarly-sweeps-demo-secret-change-in-real-deploy";
const isProd = process.env.NODE_ENV === "production";
const COOKIE_NAME = "ss_token";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

async function loadJSON(file) {
  const raw = await readFile(dataPath(file), "utf-8");
  return JSON.parse(raw);
}

function signToken(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

// Attaches req.user if a valid session cookie is present. Never blocks the request.
function attachUser(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not signed in." });
  next();
}

app.use(attachUser);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "scholarly-sweeps-api" });
});

// --- Static reference data ---
app.get("/api/packages", async (req, res) => res.json(await loadJSON("packages.json")));
app.get("/api/addons", async (req, res) => res.json(await loadJSON("addons.json")));
app.get("/api/cleaners", async (req, res) => res.json(await loadJSON("cleaners.json")));
app.get("/api/survey", async (req, res) => res.json(await loadJSON("surveyData.json")));

// --- Auth ---
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

  const normalizedEmail = email.toLowerCase();
  if (usersDb.findByEmail(normalizedEmail)) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const user = {
    id: randomUUID(),
    name,
    email: normalizedEmail,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };
  usersDb.insert(user);

  const token = signToken(user);
  setAuthCookie(res, token);
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

  const user = usersDb.findByEmail(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  const token = signToken(user);
  setAuthCookie(res, token);
  res.json({ id: user.id, name: user.name, email: user.email });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ user: req.user || null });
});

// --- Bookings ---
// Create a demo booking. No payment is processed; this simulates the flow only.
app.post("/api/bookings", (req, res) => {
  const { address, packageId, cleanerId, suppliesProvided, notes, addonIds, date, timeSlot, name, phone, email } = req.body;

  if (!address || !packageId || !cleanerId || suppliesProvided === undefined || !date || !timeSlot) {
    return res.status(400).json({ error: "Missing required booking fields." });
  }

  const booking = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    userId: req.user ? req.user.id : null,
    address,
    packageId,
    cleanerId,
    suppliesProvided: !!suppliesProvided,
    notes: notes || "",
    addonIds: addonIds || [],
    date,
    timeSlot,
    name: name || (req.user ? req.user.name : "Demo Student"),
    phone: phone || "",
    email: email || (req.user ? req.user.email : "demo@utdallas.edu"),
    status: "confirmed (demo — no charge, no cleaner dispatched)",
    createdAt: new Date().toISOString()
  };

  bookingsDb.insert(booking);
  res.status(201).json(booking);
});

app.get("/api/bookings/mine", requireAuth, (req, res) => {
  res.json(bookingsDb.byUser(req.user.id));
});

app.get("/api/bookings/:id", (req, res) => {
  const booking = bookingsDb.byId(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  res.json(booking);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Scholarly Sweeps API running on http://localhost:${PORT}`);
});
