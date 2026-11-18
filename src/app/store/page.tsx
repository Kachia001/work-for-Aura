import { Suspense } from "react";
import type { Metadata } from "next";
import { StoreBanner } from "@/features/books/components/store-banner";
import { StoreCatalog } from "@/features/books/components/store-catalog";
import { BookGridSkeleton } from "@/features/books/components/book-grid";

export const metadata: Metadata = {
  title: "스토어 | 히든카이스",
  description: "히든카이스 교재와 패스를 만나보세요.",
};

export default function StorePage() {
  return (
    <>
      <a href="#catalog-top" className="skip-link">
        교재 목록으로 건너뛰기
      </a>
      <main>
        <h1 className="sr-only">히든카이스 스토어</h1>
        <StoreBanner />
        <div id="catalog-top" className="scroll-mt-28" />
        <Suspense
          fallback={
            <div className="store-container py-16">
              <BookGridSkeleton />
            </div>
          }
        >
          <StoreCatalog />
        </Suspense>
      </main>
    </>
  );
}
