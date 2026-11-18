import "server-only";
import "reflect-metadata";
import { Container } from "inversify";
import { HealthController } from "@/server/controllers/health-controller";
import { HealthService } from "@/server/services/health-service";
import { TOKENS } from "./tokens";
import type { BookRepository } from "@/server/repositories/book-repository";
import { DrizzleBookRepository } from "@/server/repositories/drizzle-book-repository";
import { BookService } from "@/server/services/book-service";
import { BookController } from "@/server/controllers/book-controller";

export const container = new Container();
container
  .bind<BookRepository>(TOKENS.bookRepository)
  .toDynamicValue(() => new DrizzleBookRepository())
  .inSingletonScope();

container
  .bind<BookService>(TOKENS.bookService)
  .toDynamicValue(
    (context) =>
      new BookService(context.get<BookRepository>(TOKENS.bookRepository)),
  )
  .inSingletonScope();

container
  .bind<BookController>(TOKENS.bookController)
  .toDynamicValue(
    (context) =>
      new BookController(context.get<BookService>(TOKENS.bookService)),
  )
  .inSingletonScope();

container
  .bind<HealthService>(TOKENS.healthService)
  .toDynamicValue(() => new HealthService())
  .inSingletonScope();

container
  .bind<HealthController>(TOKENS.healthController)
  .toDynamicValue(
    (context) =>
      new HealthController(context.get<HealthService>(TOKENS.healthService)),
  )
  .inSingletonScope();
