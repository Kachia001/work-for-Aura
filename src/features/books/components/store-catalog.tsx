"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { fetchBooks } from "@/features/books/api";
import { useBookFilters } from "@/app/store/customHook/use-book-filters";
import { StoreToolbar } from "./store-toolbar";
import { BookGrid, BookGridSkeleton } from "./book-grid";
import { StorePagination } from "./store-pagination";

export function StoreCatalog() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const {
    search,
    searchText,
    updateSearch,
    changeType,
    changePage,
    resetFilters,
    pageHref,
  } = useBookFilters({
    params,
    pathname,
    push: router.push,
    replace: router.replace,
  });

  const { data, isPending, isError, isSuccess, isFetching, refetch } = useQuery(
    {
      queryKey: ["books", search],
      queryFn: ({ signal }) => fetchBooks(search, signal),
      retry: 1,
    },
  );

  return (
    <section aria-label="교재 목록" className="store-container store-catalog">
      <StoreToolbar
        value={searchText}
        type={search.type}
        onSearch={updateSearch}
        onType={changeType}
      />

      <div aria-busy={isFetching}>
        {isPending && <BookGridSkeleton />}

        {isError && (
          <Alert variant="destructive" className="catalog-message">
            <AlertTitle>교재를 불러오지 못했습니다.</AlertTitle>
            <AlertDescription>
              잠시 후 다시 시도해 주세요.
              <Button variant="outline" onClick={() => refetch()}>
                다시 시도
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && data.items.length > 0 && (
          <BookGrid books={data.items} />
        )}

        {isSuccess && data.items.length === 0 && (
          <div className="catalog-message text-center">
            <p>검색 결과가 없습니다.</p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              전체 교재 보기
            </Button>
          </div>
        )}
      </div>

      <p className="sr-only" role="status">
        {isPending && "교재 목록을 불러오는 중"}
        {isError && "교재 목록을 불러오지 못했습니다."}
        {isSuccess && `총 ${data.total}개의 교재, ${data.page}페이지`}
      </p>

      {data && data.totalPages > 0 && (
        <StorePagination
          page={search.page}
          totalPages={data.totalPages}
          href={pageHref}
          onPage={(number) => {
            changePage(number);
            const catalogTop = document.getElementById("catalog-top");
            if (catalogTop) catalogTop.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}
    </section>
  );
}
