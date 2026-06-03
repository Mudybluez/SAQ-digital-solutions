import express from "express";
import { rateLimit } from "express-rate-limit";
import { initDb, saveLead, listLeads } from "./db.js";

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));

const PORT = process.env.PORT || 3001;

// Auth Middleware for Admin endpoints
function auth(req, res, next) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return res.status(404).send("Админка отключена.");
  const header = req.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [, given] = Buffer.from(encoded, "base64").toString().split(":");
    if (given === pass) return next();
  }
  res.set("WWW-Authenticate", 'Basic realm="SAQ Admin"');
  return res.status(401).send("Требуется авторизация.");
}

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Слишком много заявок. Попробуйте позже." },
});

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const ALLOWED_TYPES = new Set(["landing", "business", "platform", "unknown"]);

// Health check
app.get("/api/lead/health", (req, res) => res.json({ ok: true, service: "leads" }));

// Post lead
app.post("/api/lead", limiter, async (req, res) => {
  const body = req.body || {};

  // Honeypot field
  if (clean(body.company, 100)) {
    return res.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const contact = clean(body.phone ?? body.contact, 120);
  const type = ALLOWED_TYPES.has(body.type) ? body.type : "unknown";
  const message = clean(body.desc ?? body.message, 2000);

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: "Укажите имя и контакт." });
  }

  const lead = { name, contact, type, message, ip: req.ip, user_agent: clean(req.get("user-agent"), 300) };

  try {
    const id = await saveLead(lead);
    
    // Decoupled notification microservice call
    fetch("http://notifications:3004/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, id })
    }).catch((e) => console.error("[leads] notification trigger failed:", e.message));

    return res.json({ ok: true, id });
  } catch (err) {
    console.error("[leads] save error:", err);
    return res.status(500).json({ ok: false, error: "Не удалось сохранить заявку." });
  }
});

// Admin get list
app.get("/api/lead/list", auth, async (req, res) => {
  try {
    const leads = await listLeads();
    return res.json({ ok: true, leads });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Boot DB & Web Server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Leads Microservice listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[leads] Database initialization failed:", err);
    process.exit(1);
  });
