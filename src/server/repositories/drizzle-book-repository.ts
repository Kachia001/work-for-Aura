import "server-only";
import { and, asc, count, eq, ilike } from "drizzle-orm";
import type { BookSearch } from "@/features/books/types";
import { getDatabase } from "@/server/db";
import { books } from "@/server/db/schema";
import type { BookRepository } from "./book-repository";

export class DrizzleBookRepository implements BookRepository {
  async findPage(search: BookSearch, pageSize: number) {
    const escaped = search.q.replace(/[\\%_]/g, "\\$&");
    const where = and(
      search.q ? ilike(books.name, `%${escaped}%`) : undefined,
      search.type === "all" ? undefined : eq(books.type, search.type),
    );
    return getDatabase().transaction(
      async (tx) => {
        const [result] = await tx
          .select({ total: count() })
          .from(books)
          .where(where);
        const rows = await tx
          .select()
          .from(books)
          .where(where)
          .orderBy(asc(books.sortOrder), asc(books.id))
          .limit(pageSize)
          .offset((search.page - 1) * pageSize);
        return { rows, total: result.total };
      },
      { isolationLevel: "repeatable read", accessMode: "read only" },
    );
  }
}
