import type { BookSearch } from "@/features/books/types";
import type { books } from "@/server/db/schema";

export interface BookRepository {
  findPage(
    search: BookSearch,
    pageSize: number,
  ): Promise<{
    rows: (typeof books.$inferSelect)[];
    total: number;
  }>;
}
