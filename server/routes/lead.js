import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { saveLead } from "../db.js";
import { notifyLead } from "../lib/notify.js";

const router = Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 8, // не больше 8 заявок с одного IP за окно
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Слишком много заявок. Попробуйте позже." },
});

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const ALLOWED_TYPES = new Set(["landing", "business", "platform", "unknown"]);

router.post("/", limiter, async (req, res) => {
  const body = req.body || {};

  // Honeypot: скрытое поле, которое заполняют только боты.
  if (clean(body.company, 100)) {
    return res.json({ ok: true }); // тихо игнорируем спам
  }

  const name = clean(body.name, 100);
  const contact = clean(body.phone ?? body.contact, 120);
  const type = ALLOWED_TYPES.has(body.type) ? body.type : "unknown";
  const message = clean(body.desc ?? body.message, 2000);

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: "Укажите имя и контакт." });
  }

  const lead = {
    name,
    contact,
    type,
    message,
    ip: req.ip,
    user_agent: clean(req.get("user-agent"), 300),
  };

  try {
    const id = saveLead(lead);
    notifyLead(lead, id).catch((e) => console.error("[lead] notify error:", e));
    return res.json({ ok: true, id });
  } catch (err) {
    console.error("[lead] save error:", err);
    return res.status(500).json({ ok: false, error: "Не удалось сохранить заявку." });
  }
});

export default router;
