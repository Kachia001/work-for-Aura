import { container } from "@/server/di/container";
import { TOKENS } from "@/server/di/tokens";
import type { BookController } from "@/server/controllers/book-controller";
import { handleApiError } from "@/server/http/api-error";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    return await container
      .get<BookController>(TOKENS.bookController)
      .get(request);
  } catch (error) {
    return handleApiError(error);
  }
}
