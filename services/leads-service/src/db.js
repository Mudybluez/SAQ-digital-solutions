import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "postgres://saq_user:saq_pass@db:5432/saq_db";

const pool = new Pool({
  connectionString,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        message TEXT,
        ip VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("[leads-db] Leads table is ready.");
  } finally {
    client.release();
  }
}

export async function saveLead(lead) {
  const query = `
    INSERT INTO leads (name, contact, type, message, ip, user_agent)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  const values = [lead.name, lead.contact, lead.type, lead.message, lead.ip, lead.user_agent];
  const res = await pool.query(query, values);
  return res.rows[0].id;
}

export async function listLeads(limit = 200) {
  const res = await pool.query("SELECT * FROM leads ORDER BY id DESC LIMIT $1", [limit]);
  return res.rows;
}

export default pool;
