import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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

let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString && (process.env.host || process.env.HOST || process.env.PGHOST)) {
  const user = process.env.user || process.env.USER || process.env.PGUSER || "postgres";
  const password = encodeURIComponent(process.env.password || process.env.PASSWORD || process.env.PGPASSWORD || "");
  const host = process.env.host || process.env.HOST || process.env.PGHOST;
  const port = process.env.port || process.env.PORT || process.env.PGPORT || "5432";
  const database = process.env.database || process.env.DATABASE || process.env.PGDATABASE || "postgres";
  connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

async function runSetup() {
  console.log("==================================================");
  console.log("   WIJAYA DARY DIMAS - DATABASE MIGRATION RUNNER  ");
  console.log("==================================================");

  if (!connectionString) {
    console.warn("⚠️  DATABASE_URL tidak ditemukan di environment atau .env.local.");
    console.log("ℹ️  Aplikasi webprofile saat ini berjalan menggunakan Local Adaptive Store.");
    console.log("   Untuk menghubungkan PostgreSQL / Supabase, atur DATABASE_URL di .env.local:");
    console.log('   DATABASE_URL="postgres://user:password@host:5432/dbname"');
    console.log("\n   Setelah diatur, jalankan kembali: node scripts/db-setup.mjs\n");
    return;
  }

  // Obfuscate secret for logging
  const maskedUrl = connectionString.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:****@");
  console.log(`🔗 Menghubungkan ke database: ${maskedUrl}`);

  const client = new Client({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("✅ Koneksi database berhasil!");

    const migrationFile = path.join(rootDir, "database", "migrations", "001_initial_schema.sql");
    if (!fs.existsSync(migrationFile)) {
      throw new Error(`File migrasi tidak ditemukan di: ${migrationFile}`);
    }

    console.log("📄 Membaca berkas migrasi: 001_initial_schema.sql");
    const sql = fs.readFileSync(migrationFile, "utf8");

    console.log("⚙️  Menjalankan migrasi skema tabel, indeks, dan RLS...");
    await client.query(sql);

    console.log("🔍 Memverifikasi tabel yang telah dibuat...");
    const verifyResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = verifyResult.rows.map((r) => r.table_name);
    console.log("📋 Tabel terverifikasi di schema public:");
    for (const table of tables) {
      console.log(`   - ${table}`);
    }

    console.log("\n🎉 Migrasi database berhasil diselesaikan tanpa error!");
  } catch (err) {
    console.error("❌ Terjadi kegagalan saat menjalankan migrasi:", err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

runSetup();
