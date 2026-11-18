import { loadEnvConfig } from "@next/env";
import { createDatabase } from "@/server/db/connection";
import { books } from "@/server/db/schema";
import source from "./data/source-books.json";

async function main() {
  loadEnvConfig(process.cwd());
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const { db, client } = createDatabase(process.env.DATABASE_URL);
  const price = (value: string) => Number(value.replace(/[^0-9]/g, ""));
  try {
    await db.transaction(async (tx) => {
      const seedItems = [
        ...source,
        ...source.map((item, index) => ({
          ...item,
          id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
          name: `${item.name} (추가 더미)`,
        })),
      ];
      for (const [sortOrder, item] of seedItems.entries()) {
        const book = {
          id: item.id,
          name: item.name,
          type: item.type as "pass" | "single",
          imagePath: `/images/books/${source[sortOrder % source.length].id}.webp`,
          originalPrice: price(item.prices[0]),
          salePrice: price(item.prices.at(-1)!),
          sortOrder,
        };
        await tx
          .insert(books)
          .values(book)
          .onConflictDoUpdate({ target: books.id, set: book });
      }
    });
    console.log(`Seeded ${source.length * 2} books (idempotent upsert)`);
  } finally {
    await client.end();
  }
}
main().catch(() => {
  console.error("Book seed failed. Check database configuration.");
  process.exitCode = 1;
});
