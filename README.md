# SAQ Digital Solutions

Сайт агентства веб-разработки (Астана). Статический фронтенд + лёгкий Express-бэкенд: приём заявок с формы, валидация, анти-спам, архив в SQLite и уведомления в Telegram/email.

## Стек

- **Бэкенд:** Node.js (≥18), Express, better-sqlite3, express-rate-limit
- **Фронтенд:** ванильный HTML/CSS/JS, GSAP + ScrollTrigger (с CDN), шрифты Outfit + Geist Mono
- **База:** SQLite-файл `data/leads.db` (создаётся автоматически)

## Структура

```
saq/
├── server/
│   ├── index.js          Express: отдаёт фронт + API
│   ├── db.js             SQLite: таблица leads, saveLead / listLeads
│   ├── routes/lead.js    POST /api/lead — валидация, honeypot, rate-limit
│   ├── routes/admin.js   GET /admin — просмотр заявок (Basic Auth)
│   └── lib/notify.js     отправка в Telegram / email (по наличию env)
├── public/               фронтенд
│   ├── index.html
│   ├── css/styles.css
│   ├── js/main.js        анимации + отправка формы на /api/lead
│   ├── work/             страницы кейсов (задел)
│   └── assets/           изображения
├── data/leads.db         база заявок (в .gitignore)
├── .env.example
├── package.json
└── README.md
```

## Запуск

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm start                # http://localhost:3000
```

Для разработки с авто-перезапуском:

```bash
npm run dev
```

> `better-sqlite3` — нативный модуль. При установке нужны build-tools
> (на Windows обычно ставятся вместе с Node.js; иначе `npm i -g windows-build-tools`).

## Приём заявок

Форма на главной отправляет `POST /api/lead`. Бэкенд:

- проверяет обязательные поля (имя + контакт);
- отбрасывает ботов через honeypot-поле `company` (скрыто от людей);
- ограничивает частоту: 8 заявок с одного IP за 10 минут;
- сохраняет заявку в `data/leads.db`;
- шлёт уведомление в Telegram и/или на email, если они настроены в `.env`.

Заявка сохраняется в базу **всегда**, даже если уведомления не настроены.

## Настройка уведомлений (.env)

Всё опционально — без настройки заявки просто копятся в базе и видны в `/admin`.

**Telegram:**
1. Создайте бота у [@BotFather](https://t.me/BotFather) → `/newbot`, скопируйте `TELEGRAM_BOT_TOKEN`.
2. Напишите своему боту любое сообщение.
3. Откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и возьмите `chat.id` → `TELEGRAM_CHAT_ID`.

**Email (SMTP):** заполните `SMTP_*` и `LEAD_EMAIL_TO`, затем `npm i nodemailer`.

## Админка заявок

Задайте `ADMIN_PASSWORD` в `.env` → откройте `http://localhost:3000/admin`
(логин любой, пароль — заданный). Без пароля раздел выключен.

## Деплой

Подойдёт любой хост с Node.js (VPS, Railway, Render и т.п.):

1. Загрузите проект, `npm install --omit=dev`.
2. Задайте переменные окружения (`PORT`, токены).
3. Запустите `npm start` под процесс-менеджером (например, `pm2`).
4. Поставьте Nginx/Caddy как reverse-proxy с HTTPS.

Папку `data/` нужно сохранять между деплоями — там лежит база заявок.
