import "server-only";

export const TOKENS = {
  bookRepository: Symbol.for("BookRepository"),
  bookService: Symbol.for("BookService"),
  bookController: Symbol.for("BookController"),
  healthService: Symbol.for("HealthService"),
  healthController: Symbol.for("HealthController"),
} as const;
