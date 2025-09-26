// CommonJS version for widest compatibility
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();

// ---- config ----
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "change_this";
const COOKIE_NAME = "ys_session";
const COOKIE_SECURE = String(process.env.COOKIE_SECURE).toLowerCase() === "true";

// If later behind a proxy (CloudFront/ELB), uncomment:
// app.set("trust proxy", 1);

// ---- middleware ----
app.use(helmet({
  contentSecurityPolicy: false, // keep simple for dev
}));
app.use(morgan("dev"));
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Global rate limit (basic)
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // tune as needed
  standardHeaders: true,
  legacyHeaders: false,
}));

// Extra strict limiter for login to deter brute force
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// ---- user storage ----
const userPath = path.join(__dirname, "user.json");
function loadUser() {
  const raw = fs.readFileSync(userPath, "utf8");
  return JSON.parse(raw);
}

// ---- auth helpers ----
function signSession(payload) {
  // 7 day expiry
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authRequired(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthenticated" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid session" });
  }
}

// ---- routes ----
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  const { username: u, passwordHash } = loadUser();
  if (username !== u) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const ok = await bcrypt.compare(password, passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = signSession({ username });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    path: "/",
    maxAge: 24 * 60 *60 * 1 * 1000, // 24 hours for demo; adjust as needed
  });
  return res.json({ success: true });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ success: true });
});

app.get("/api/me", (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.json({ authenticated: false });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ authenticated: true, user: { username: payload.username } });
  } catch {
    return res.json({ authenticated: false });
  }
});

// Example protected route
app.get("/api/admin/secret", authRequired, (_req, res) => {
  res.json({ message: "Top secret admin data" });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

// Optional: friendly root message
app.get("/", (_req, res) => res.send("Yantrashilpa API is running"));
