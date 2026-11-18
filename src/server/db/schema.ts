import {
  check,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const bookType = pgEnum("book_type", ["pass", "single"]);
export const books = pgTable(
  "books",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    type: bookType("type").notNull(),
    imagePath: text("image_path").notNull(),
    originalPrice: integer("original_price").notNull(),
    salePrice: integer("sale_price").notNull(),
    sortOrder: integer("sort_order").notNull(),
  },
  (table) => [
    check(
      "books_prices_valid",
      sql`${table.salePrice} >= 0 and ${table.originalPrice} >= ${table.salePrice}`,
    ),
  ],
);
