require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const http       = require("http");           // ← NEW
const { Server } = require("socket.io");      // ← NEW
const connectDB  = require("./config/db");

const app    = express();
const server = http.createServer(app);        // ← NEW: wrap express in http server

// ── Socket.io ────────────────────────────────────────────────
const io = new Server(server, {              // ← NEW: attach socket to http server
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ── Load socket handler ───────────────────────────────────────
require("./socket/socketHandler")(io);        // ← NEW: pass io to your handler

// ── Database ──────────────────────────────────────────────────
connectDB();

// ── Security Headers ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/auth.routes"));
app.use("/api/jobs",    require("./routes/job.routes"));
app.use("/api/workers", require("./routes/worker.routes"));
app.use("/api/chat",    require("./routes/chat.routes"));
app.use("/api/ai",      require("./routes/ai.routes"));
app.use("/api/admin",   require("./routes/admin.routes"));

// ── Health Check ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Rozgar Backend Running");
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum 5MB allowed." });
  }
  if (err.message && err.message.includes("Only JPG")) {
    return res.status(400).json({ error: err.message });
  }
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ── Start Server ──────────────────────────────────────────────
// ❌ OLD: app.listen(PORT) — this does NOT support Socket.io
// ✅ NEW: server.listen(PORT) — http server supports Socket.io
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Socket.io ready ✅`);
});