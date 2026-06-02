// Уведомления о новой заявке.
// Каналы включаются автоматически, когда в .env заданы их переменные.
// Сейчас можно ничего не настраивать — заявки всё равно пишутся в базу.

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
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!res.ok) console.error("[notify] Telegram error:", await res.text());
    return res.ok;
  } catch (err) {
    console.error("[notify] Telegram failed:", err.message);
    return false;
  }
}

async function notifyEmail(text, lead) {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, LEAD_EMAIL_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_EMAIL_TO) return false;
  let nodemailer;
  try {
    nodemailer = (await import("nodemailer")).default;
  } catch {
    console.warn("[notify] Email настроен, но пакет nodemailer не установлен (npm i nodemailer).");
    return false;
  }
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
    console.error("[notify] Email failed:", err.message);
    return false;
  }
}

export async function notifyLead(lead, id) {
  const text = formatLead(lead, id);
  const results = await Promise.allSettled([notifyTelegram(text), notifyEmail(text, lead)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  if (!delivered) {
    console.log("[notify] Каналы уведомлений не настроены. Заявка сохранена в базе:\n" + text + "\n");
  }
  return delivered;
}
