export type BookType = "pass" | "single";
export type BookFilter = BookType | "all";
export interface Book {
  id: string;
  name: string;
  type: BookType;
  imagePath: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
}
export interface BookSearch {
  q: string;
  type: BookFilter;
  page: number;
  pageSize?: number;
}
export interface BookListResponse {
  items: Book[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
