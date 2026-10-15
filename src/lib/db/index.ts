import type { DatabaseRepository } from "./adapter";
import { LocalStoreRepository } from "./store";
import { PostgresRepository } from "./postgres";

let repositoryInstance: DatabaseRepository | null = null;

export function getDatabase(): DatabaseRepository {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  const hasDbConfig =
    Boolean(process.env.DATABASE_URL) ||
    Boolean(process.env.POSTGRES_URL) ||
    Boolean(process.env.host) ||
    Boolean(process.env.HOST) ||
    Boolean(process.env.PGHOST);

  if (hasDbConfig) {
    try {
      repositoryInstance = new PostgresRepository();
      return repositoryInstance;
    } catch (err) {
      console.warn("⚠️ Gagal inisialisasi PostgresRepository, beralih ke LocalStore:", err);
    }
  }

  // Safe fallback for zero-config local development
  repositoryInstance = new LocalStoreRepository();
  return repositoryInstance;
}

export const db = getDatabase();
