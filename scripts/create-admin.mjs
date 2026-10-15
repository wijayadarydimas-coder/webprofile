import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import pg from "pg";

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Load .env.local if present
const envLocalPath = path.join(rootDir, ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;
const name = process.argv[4] || process.env.ADMIN_NAME || process.env.ADIM_NAME || "Wijaya Dary Dimas";

if (!email || !password) {
  console.error("❌ Error: Email atau Password admin belum ditentukan.");
  console.error("   Harap isi ADMIN_EMAIL dan ADMIN_PASSWORD di .env.local,");
  console.error("   atau jalankan dengan argumen: node scripts/create-admin.mjs <email> <password> [name]");
  process.exit(1);
}

async function createAdmin() {
  console.log("==========================================");
  console.log("       INSIALISASI AKUN ADMIN SISTEM      ");
  console.log("==========================================");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString && (process.env.host || process.env.HOST || process.env.PGHOST)) {
    const dbUser = process.env.user || process.env.USER || process.env.PGUSER || "postgres";
    const dbPass = encodeURIComponent(process.env.password || process.env.PASSWORD || process.env.PGPASSWORD || "");
    const dbHost = process.env.host || process.env.HOST || process.env.PGHOST;
    const dbPort = process.env.port || process.env.PORT || process.env.PGPORT || "5432";
    const dbName = process.env.database || process.env.DATABASE || process.env.PGDATABASE || "postgres";
    connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`;
  }

  if (connectionString) {
    const client = new Client({
      connectionString,
      ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      const query = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES ($1, $2, $3, 'admin')
        ON CONFLICT (email) 
        DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin', name = EXCLUDED.name
        RETURNING id, name, email, role;
      `;
      const res = await client.query(query, [name, email, passwordHash]);
      console.log("✅ Admin berhasil didaftarkan di PostgreSQL:");
      console.log(res.rows[0]);
    } catch (err) {
      console.error("❌ Gagal membuat admin di PostgreSQL:", err.message);
    } finally {
      await client.end().catch(() => {});
    }
  } else {
    // Save to local store fallback
    const dataDir = path.join(rootDir, ".data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const dbPath = path.join(dataDir, "db.json");
    let store = { users: [] };
    if (fs.existsSync(dbPath)) {
      try {
        store = JSON.parse(fs.readFileSync(dbPath, "utf8"));
      } catch {}
    }
    if (!store.users) store.users = [];

    const existingIdx = store.users.findIndex((u) => u.email === email);
    const adminUser = {
      id: "admin-master-id",
      name,
      email,
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      store.users[existingIdx] = adminUser;
    } else {
      store.users.push(adminUser);
    }

    fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), "utf8");
    console.log("✅ Admin berhasil didaftarkan di Local Store:");
    console.log(`   Email: ${email}`);
    console.log("   Role: admin");
  }
}

createAdmin();
