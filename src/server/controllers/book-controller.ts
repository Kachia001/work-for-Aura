import "server-only";
import type { BookService } from "@/server/services/book-service";
import { ApiError } from "@/server/http/api-error";

export class BookController {
  constructor(private readonly service: BookService) {}

  async get(request: Request) {
    const params = new URL(request.url).searchParams;
    const type = params.get("type") ?? "all";
    const pageValue = params.get("page") ?? "1";
    const page = Number(pageValue);
    const pageSizeValue = params.get("pageSize") ?? "12";
    const pageSize = Number(pageSizeValue);
    const q = (params.get("q") ?? "").trim();

    if (type !== "all" && type !== "pass" && type !== "single") {
      throw new ApiError(400, "올바른 상품 유형을 선택해 주세요.");
    }

    if (
      !/^[1-9]\d*$/.test(pageValue) ||
      !Number.isSafeInteger(page) ||
      page > 1_000_000
    ) {
      throw new ApiError(400, "페이지는 1 이상의 정수여야 합니다.");
    }

    if (q.length > 100) {
      throw new ApiError(400, "검색어는 100자 이하로 입력해 주세요.");
    }

    if (
      !/^[1-9]\d*$/.test(pageSizeValue) ||
      !Number.isSafeInteger(pageSize) ||
      pageSize > 100
    ) {
      throw new ApiError(
        400,
        "페이지 크기는 1 이상 100 이하의 정수여야 합니다.",
      );
    }

    const result = await this.service.list({ q, type, page, pageSize });

    return Response.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
