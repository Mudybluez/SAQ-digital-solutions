import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import leadRouter from "./routes/lead.js";
import adminRouter from "./routes/admin.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// API
app.use("/api/lead", leadRouter);
app.use("/admin", adminRouter);

app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// Статика
app.use(
  express.static(publicDir, {
    extensions: ["html"],
    setHeaders(res, path) {
      if (/\.(css|js|jpg|png|svg|woff2?)$/.test(path)) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      }
    },
  })
);

// SPA-фолбэк для несуществующих GET-маршрутов → отдаём 404-страницу или главную
app.use((req, res) => {
  res.status(404).sendFile(join(publicDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SAQ Digital Solutions → http://localhost:${PORT}`);
  if (process.env.ADMIN_PASSWORD) console.log(`Админка заявок → http://localhost:${PORT}/admin`);
});
