import express from "express";
import multer from "multer";
import { join, extname } from "node:path";
import { mkdirSync } from "node:fs";
import {
  initDb,
  getAllProjects,
  getProjectBySlug,
  insertProject,
  updateProject,
  deleteProject,
  getSettings,
  upsertSettings
} from "./db.js";

const app = express();
app.use(express.json({ limit: "12mb" }));

const PORT = process.env.PORT || 3002;
const UPLOADS_DIR = "/app/uploads";
mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve uploads statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Auth Middleware
function auth(req, res, next) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return res.status(404).send("Админка отключена.");
  const header = req.get("authorization") || "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [, given] = Buffer.from(encoded, "base64").toString().split(":");
    if (given === pass) return next();
  }
  // res.set("WWW-Authenticate", 'Basic realm="SAQ Admin"');
  return res.status(401).send("Требуется авторизация.");
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "img-" + uniqueSuffix + extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const mime = allowed.test(file.mimetype);
    const ext = allowed.test(extname(file.originalname).toLowerCase());
    if (mime && ext) return cb(null, true);
    cb(new Error("Допускаются только изображения (jpg, png, gif, webp, svg)."));
  }
});

const ensureParsed = (val, fallback) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val ?? fallback;
};

// Health Check
app.get("/api/projects/health", (req, res) => res.json({ ok: true, service: "portfolio" }));

// Get all
app.get("/api/projects", async (req, res) => {
  try {
    const rawList = await getAllProjects();
    const projects = rawList.map(p => ({
      ...p,
      tags: ensureParsed(p.tags, []),
      facts: ensureParsed(p.facts, {}),
      solution_points: ensureParsed(p.solution_points, []),
      results: ensureParsed(p.results, []),
      screens: ensureParsed(p.screens, [])
    }));
    return res.json({ ok: true, projects });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Get by slug
app.get("/api/projects/:slug", async (req, res) => {
  try {
    const p = await getProjectBySlug(req.params.slug);
    if (!p) return res.status(404).json({ ok: false, error: "Кейс не найден." });
    const project = {
      ...p,
      tags: ensureParsed(p.tags, []),
      facts: ensureParsed(p.facts, {}),
      solution_points: ensureParsed(p.solution_points, []),
      results: ensureParsed(p.results, []),
      screens: ensureParsed(p.screens, [])
    };
    return res.json({ ok: true, project });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Image upload
app.post("/api/projects/upload-image", auth, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "Файл не загружен." });
  }
  return res.json({ ok: true, url: `/uploads/${req.file.filename}` });
});

// Create
app.post("/api/projects", auth, async (req, res) => {
  const body = req.body || {};

  if (!body.title || !body.slug || !body.description || !body.category) {
    return res.status(400).json({ ok: false, error: "Заполните обязательные поля." });
  }

  const project = {
    slug: body.slug.trim().toLowerCase(),
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category.trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    image: body.image || "night",
    link: body.link ? body.link.trim() : null,
    overview: body.overview ? body.overview.trim() : "",
    facts: body.facts && typeof body.facts === "object" ? body.facts : {},
    challenge: body.challenge ? body.challenge.trim() : "",
    solution: body.solution ? body.solution.trim() : "",
    solution_points: Array.isArray(body.solution_points) ? body.solution_points : [],
    results_title: body.results_title ? body.results_title.trim() : "Результаты",
    results: Array.isArray(body.results) ? body.results : [],
    screens: Array.isArray(body.screens) ? body.screens : []
  };

  try {
    const id = await insertProject(project);
    return res.json({ ok: true, id });
  } catch (err) {
    console.error("[portfolio] Insert error:", err);
    if (err.message.includes("unique constraint") || err.message.includes("UNIQUE constraint")) {
      return res.status(400).json({ ok: false, error: "Кейс с таким slug уже существует." });
    }
    return res.status(500).json({ ok: false, error: "Не удалось сохранить кейс." });
  }
});

// Update
app.put("/api/projects/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};

  if (!body.title || !body.slug || !body.description || !body.category) {
    return res.status(400).json({ ok: false, error: "Заполните обязательные поля." });
  }

  const project = {
    slug: body.slug.trim().toLowerCase(),
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category.trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    image: body.image || "night",
    link: body.link ? body.link.trim() : null,
    overview: body.overview ? body.overview.trim() : "",
    facts: body.facts && typeof body.facts === "object" ? body.facts : {},
    challenge: body.challenge ? body.challenge.trim() : "",
    solution: body.solution ? body.solution.trim() : "",
    solution_points: Array.isArray(body.solution_points) ? body.solution_points : [],
    results_title: body.results_title ? body.results_title.trim() : "Результаты",
    results: Array.isArray(body.results) ? body.results : [],
    screens: Array.isArray(body.screens) ? body.screens : []
  };

  try {
    await updateProject(id, project);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[portfolio] Update error:", err);
    return res.status(500).json({ ok: false, error: "Не удалось обновить кейс." });
  }
});

// Delete
app.delete("/api/projects/:id", auth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await deleteProject(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[portfolio] Delete error:", err);
    return res.status(500).json({ ok: false, error: "Не удалось удалить кейс." });
  }
});

// Get settings
app.get("/api/projects/settings/:key", async (req, res) => {
  try {
    const val = await getSettings(req.params.key);
    return res.json({ ok: true, value: val });
  } catch (err) {
    console.error("[portfolio] Get settings error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Update settings
app.post("/api/projects/settings/:key", auth, async (req, res) => {
  try {
    const { value } = req.body || {};
    if (value === undefined) {
      return res.status(400).json({ ok: false, error: "Значение настроек не передано." });
    }
    await upsertSettings(req.params.key, value);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[portfolio] Upsert settings error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Boot DB & Server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Portfolio Microservice listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[portfolio] Database initialization failed:", err);
    process.exit(1);
  });
