import { loadEnvConfig } from "@next/env";
import { sql } from "drizzle-orm";
import { createDatabase } from "@/server/db/connection";

async function main() {
  loadEnvConfig(process.cwd());
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required. See .env.example.");
  const { db, client } = createDatabase(url);
  try {
    await db.execute(sql`select 1`);
    console.log("Drizzle database connection OK");
  } finally {
    await client.end();
  }
}

main().catch(() => {
  console.error(
    "Database connection failed. Check DATABASE_URL and Supabase status.",
  );
  process.exitCode = 1;
});
