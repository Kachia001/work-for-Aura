import "server-only";
import { createDatabase } from "./connection";

const globalForDb = globalThis as typeof globalThis & {
  auraworksDatabase?: ReturnType<typeof createDatabase>;
};

export function getDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required. See .env.example.");
  const connection = globalForDb.auraworksDatabase ?? createDatabase(url);
  globalForDb.auraworksDatabase = connection;
  return connection.db;
}
