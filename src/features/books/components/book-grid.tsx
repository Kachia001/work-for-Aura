import type { Book } from "@/features/books/types";
import { BookCard } from "./book-card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookGrid({ books }: { books: Book[] }) {
  return (
    <div className="book-grid">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

export function BookGridSkeleton() {
  return (
    <div className="book-grid" role="status" aria-label="교재 목록 불러오는 중">
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className="space-y-3" aria-hidden="true">
          <Skeleton className="aspect-[250/337] w-full rounded-md" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}
