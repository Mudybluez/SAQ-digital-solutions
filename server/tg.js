/**
 * Помощник настройки Telegram-уведомлений.
 *
 *   node server/tg.js chatid   — показать chat_id (напишите боту сообщение перед запуском)
 *   node server/tg.js test     — отправить тестовое сообщение в TELEGRAM_CHAT_ID
 *
 * Перед запуском задайте TELEGRAM_BOT_TOKEN в .env (а для test — ещё и TELEGRAM_CHAT_ID).
 */
import "dotenv/config";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API = (m) => `https://api.telegram.org/bot${TOKEN}/${m}`;

function requireToken() {
  if (!TOKEN) {
    console.error("✗ TELEGRAM_BOT_TOKEN не задан в .env. Получите токен у @BotFather и впишите его.");
    process.exit(1);
  }
}

async function showChatId() {
  requireToken();
  const res = await fetch(API("getUpdates"));
  const data = await res.json();
  if (!data.ok) {
    console.error("✗ Telegram вернул ошибку:", data.description);
    process.exit(1);
  }
  const chats = new Map();
  const topics = new Map(); // chatId -> Map(thread id -> name)
  for (const u of data.result) {
    const msg = u.message || u.channel_post || u.my_chat_member || {};
    const c = msg.chat;
    if (c) chats.set(c.id, c);
    if (c && msg.message_thread_id) {
      if (!topics.has(c.id)) topics.set(c.id, new Map());
      const name = msg.forum_topic_created ? msg.forum_topic_created.name : "";
      topics.get(c.id).set(msg.message_thread_id, name);
    }
  }
  if (!chats.size) {
    console.log("Нет сообщений. Откройте бота в Telegram, нажмите Start и напишите ему любое сообщение, затем запустите снова.");
    return;
  }
  console.log("Найденные чаты (id группы → TELEGRAM_CHAT_ID):\n");
  for (const c of chats.values()) {
    const who = c.title || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.username || "";
    console.log(`  chat_id: ${c.id}   (${c.type}${who ? ", " + who : ""})`);
    const t = topics.get(c.id);
    if (t) for (const [tid, name] of t) console.log(`     тема (TELEGRAM_TOPIC_ID): ${tid}${name ? "  «" + name + "»" : ""}`);
  }
  console.log("\nЧтобы узнать id темы «Leads» — напишите любое сообщение В ЭТОЙ ТЕМЕ и запустите снова.");
}

async function sendTest() {
  requireToken();
  if (!CHAT_ID) {
    console.error("✗ TELEGRAM_CHAT_ID не задан в .env. Сначала: node server/tg.js chatid");
    process.exit(1);
  }
  const text = "✅ SAQ Digital Solutions — Telegram подключён. Уведомления о заявках будут приходить сюда.";
  const body = { chat_id: CHAT_ID, text };
  if (process.env.TELEGRAM_TOPIC_ID) body.message_thread_id = Number(process.env.TELEGRAM_TOPIC_ID);
  const res = await fetch(API("sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.ok) console.log(`✓ Тестовое сообщение отправлено${process.env.TELEGRAM_TOPIC_ID ? " в тему " + process.env.TELEGRAM_TOPIC_ID : ""}. Проверьте Telegram.`);
  else console.error("✗ Не удалось отправить:", data.description);
}

const cmd = process.argv[2];
if (cmd === "chatid") await showChatId();
else if (cmd === "test") await sendTest();
else {
  console.log("Использование:\n  node server/tg.js chatid   — узнать chat_id\n  node server/tg.js test     — отправить тестовое сообщение");
}
