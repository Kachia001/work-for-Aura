CREATE TYPE "public"."book_type" AS ENUM('pass', 'single');--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "book_type" NOT NULL,
	"image_path" text NOT NULL,
	"original_price" integer NOT NULL,
	"sale_price" integer NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "books_prices_valid" CHECK ("books"."sale_price" >= 0 and "books"."original_price" >= "books"."sale_price")
);
