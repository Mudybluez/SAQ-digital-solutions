import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, "leads.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    contact    TEXT NOT NULL,
    type       TEXT,
    message    TEXT,
    ip         TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertStmt = db.prepare(`
  INSERT INTO leads (name, contact, type, message, ip, user_agent)
  VALUES (@name, @contact, @type, @message, @ip, @user_agent)
`);

export function saveLead(lead) {
  const info = insertStmt.run(lead);
  return info.lastInsertRowid;
}

export function listLeads(limit = 200) {
  return db
    .prepare("SELECT * FROM leads ORDER BY id DESC LIMIT ?")
    .all(limit);
}

export default db;
