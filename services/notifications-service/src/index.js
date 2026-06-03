import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;

const TYPE_LABELS = {
  landing: "Лендинг",
  business: "Бизнес-сайт",
  platform: "Платформа",
  unknown: "Пока не знаю",
};

function formatLead(lead, id) {
  const type = TYPE_LABELS[lead.type] || lead.type || "—";
  return [
    "🎯 Новая заявка — SAQ Digital Solutions",
    `#${id}`,
    "",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    `Тип проекта: ${type}`,
    lead.message ? `Описание: ${lead.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const payload = { chat_id: chatId, text, disable_web_page_preview: true };
  const topicId = process.env.TELEGRAM_TOPIC_ID;
  if (topicId) payload.message_thread_id = Number(topicId);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("[notify-service] Telegram error:", await res.text());
    return res.ok;
  } catch (err) {
    console.error("[notify-service] Telegram failed:", err.message);
    return false;
  }
}

async function notifyEmail(text, lead) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, LEAD_EMAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_EMAIL_TO) return false;
  try {
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transport.sendMail({
      from: `SAQ Сайт <${SMTP_USER}>`,
      to: LEAD_EMAIL_TO,
      subject: `Новая заявка от ${lead.name} — SAQ`,
      text,
    });
    return true;
  } catch (err) {
    console.error("[notify-service] Email failed:", err.message);
    return false;
  }
}

app.post("/notify", async (req, res) => {
  const { lead, id } = req.body;
  if (!lead || !id) {
    return res.status(400).json({ ok: false, error: "Неверная полезная нагрузка." });
  }

  const text = formatLead(lead, id);
  console.log(`[notify-service] Processing notification for lead #${id}`);

  const results = await Promise.allSettled([
    notifyTelegram(text),
    notifyEmail(text, lead)
  ]);

  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  if (!delivered) {
    console.log("[notify-service] Уведомления не доставлены. Проверьте конфигурацию .env.");
  }

  return res.json({ ok: true, delivered });
});

app.get("/health", (req, res) => res.json({ ok: true, service: "notifications" }));

app.listen(PORT, () => {
  console.log(`Notifications service listening on port ${PORT}`);
});
