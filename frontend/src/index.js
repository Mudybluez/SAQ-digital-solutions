import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const app = express();
const PORT = process.env.PORT || 3003;

// Dynamic project detail fallback
app.get("/work/:slug", (req, res) => {
  res.sendFile(join(publicDir, "work.html"));
});

// Admin panel route mapping
app.get("/admin", (req, res) => {
  res.sendFile(join(publicDir, "admin.html"));
});

// Privacy Policy route mapping
app.get("/privacy", (req, res) => {
  res.sendFile(join(publicDir, "privacy.html"));
});

// Serve static directory
app.use(express.static(publicDir));

// Fallback to home page
app.use((req, res) => {
  res.status(404).sendFile(join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend Service listening on port ${PORT}`);
});
