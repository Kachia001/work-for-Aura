import type { BookListResponse, BookSearch } from "./types";

export async function fetchBooks(
  search: BookSearch,
  signal?: AbortSignal,
): Promise<BookListResponse> {
  const params = new URLSearchParams({
    q: search.q,
    type: search.type,
    page: String(search.page),
  });
  if (search.pageSize !== undefined)
    params.set("pageSize", String(search.pageSize));
  const response = await fetch(`/api/books?${params}`, { signal });
  if (!response.ok) throw new Error("교재 정보를 불러오지 못했습니다.");
  return response.json();
}
