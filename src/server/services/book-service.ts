import "server-only";
import type { BookListResponse, BookSearch } from "@/features/books/types";
import type { BookRepository } from "@/server/repositories/book-repository";

export class BookService {
  constructor(private readonly repository: BookRepository) {}

  async list(search: BookSearch): Promise<BookListResponse> {
    const { pageSize = 12 } = search;
    const { rows, total } = await this.repository.findPage(search, pageSize);
    return {
      items: rows.map((book) => ({
        id: book.id,
        name: book.name,
        type: book.type,
        imagePath: book.imagePath,
        originalPrice: book.originalPrice,
        salePrice: book.salePrice,
        discountRate:
          book.originalPrice > 0
            ? Math.round((1 - book.salePrice / book.originalPrice) * 100)
            : 0,
      })),
      total,
      page: search.page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
