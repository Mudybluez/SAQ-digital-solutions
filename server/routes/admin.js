import { Router } from "express";
import { listLeads } from "../db.js";

const router = Router();

// Простая защита по паролю из переменной окружения.
// Включается только если задан ADMIN_PASSWORD.
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

const TYPE_LABELS = {
  landing: "Лендинг",
  business: "Бизнес-сайт",
  platform: "Платформа",
  unknown: "Не указано",
};

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

router.get("/", auth, (req, res) => {
  const leads = listLeads();
  const rows = leads
    .map(
      (l) => `
      <tr>
        <td>${l.id}</td>
        <td>${esc(l.created_at)}</td>
        <td>${esc(l.name)}</td>
        <td>${esc(l.contact)}</td>
        <td>${esc(TYPE_LABELS[l.type] || l.type)}</td>
        <td>${esc(l.message)}</td>
      </tr>`
    )
    .join("");

  res.send(`<!doctype html><html lang="ru"><head><meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>SAQ · Заявки</title>
    <style>
      :root{--gold:#C4862A;--bg:#0C0E15;--bg2:#131620;--bg5:#2E3449;--text:#EDE0C4;--text2:#A08860}
      *{box-sizing:border-box}
      body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,sans-serif;padding:32px}
      h1{color:var(--gold);font-size:22px;margin:0 0 4px}
      p{color:var(--text2);margin:0 0 24px}
      table{width:100%;border-collapse:collapse;font-size:14px}
      th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--bg5);vertical-align:top}
      th{color:var(--gold);font-size:12px;text-transform:uppercase;letter-spacing:.06em}
      tr:hover td{background:var(--bg2)}
      td:nth-child(6){max-width:340px;color:var(--text2)}
      .empty{color:var(--text2);padding:40px 0}
    </style></head><body>
    <h1>Заявки — SAQ Digital Solutions</h1>
    <p>Всего: ${leads.length}</p>
    ${
      leads.length
        ? `<table><thead><tr><th>#</th><th>Дата (UTC)</th><th>Имя</th><th>Контакт</th><th>Тип</th><th>Описание</th></tr></thead><tbody>${rows}</tbody></table>`
        : `<div class="empty">Заявок пока нет.</div>`
    }
  </body></html>`);
});

export default router;
