import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Shared by the server-only wrapper and the CLI connectivity check.
export function createDatabase(url: string) {
  const client = postgres(url, { prepare: false, max: 5 });
  return { client, db: drizzle(client, { schema }) };
}
