import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist");

const app = express();
const PORT = process.env.PORT || 3003;

// Serve static files from the dist directory
app.use(express.static(distDir));

// Admin panel route mapping (standalone HTML page in dist/admin.html)
app.get("/admin", (req, res) => {
  res.sendFile(join(distDir, "admin.html"));
});

// For all other routes, serve index.html (client-side routing fallback)
app.get("*", (req, res) => {
  res.sendFile(join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`React Frontend Service listening on port ${PORT}`);
});
