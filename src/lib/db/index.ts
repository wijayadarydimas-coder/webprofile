import type { DatabaseRepository } from "./adapter";
import { LocalStoreRepository } from "./store";

let repositoryInstance: DatabaseRepository | null = null;

export function getDatabase(): DatabaseRepository {
  if (repositoryInstance) {
    return repositoryInstance;
  }

  // When PostgreSQL or Supabase DATABASE_URL is provided, we can connect to PostgreSQL.
  // Otherwise, default to the safe, reliable LocalStoreRepository.
  repositoryInstance = new LocalStoreRepository();
  return repositoryInstance;
}

export const db = getDatabase();
