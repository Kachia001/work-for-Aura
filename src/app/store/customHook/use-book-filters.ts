import { useEffect, useState } from "react";
import type { BookFilter, BookSearch } from "@/features/books/types";

type Navigate = (href: string, options?: { scroll?: boolean }) => void;

type FilterDependencies = {
  params: Pick<URLSearchParams, "get" | "toString">;
  pathname: string;
  push: Navigate;
  replace: Navigate;
};

const TYPE_LIST = ["all", "pass", "single"] as const;

function isBookFilter(value: unknown): value is BookFilter {
  return TYPE_LIST.some((type) => type === value);
}

export function useBookFilters({
  params,
  pathname,
  push,
  replace,
}: FilterDependencies) {
  const urlSearchText = (params.get("q") ?? "").slice(0, 100);
  const rawType = params.get("type");
  const type = isBookFilter(rawType) ? rawType : "all";
  const rawPage = params.get("page") ?? "1";
  const page =
    /^[1-9]\d*$/.test(rawPage) && Number(rawPage) <= 1_000_000
      ? Number(rawPage)
      : 1;
  const search: BookSearch = { q: urlSearchText.trim(), type, page };
  const signature = params.toString();
  const [pendingSearch, setPendingSearch] = useState<{
    value: string;
    origin: string;
  } | null>(null);

  useEffect(() => {
    const resetPendingSearch = () => setPendingSearch(null);
    window.addEventListener("popstate", resetPendingSearch);
    return () => window.removeEventListener("popstate", resetPendingSearch);
  }, []);

  function url(next: BookSearch) {
    const result = new URLSearchParams();
    if (next.q) result.set("q", next.q);
    if (next.type !== "all") result.set("type", next.type);
    if (next.page > 1) result.set("page", String(next.page));
    return `${pathname}${result.size ? `?${result}` : ""}`;
  }

  useEffect(() => {
    if (!pendingSearch || pendingSearch.origin !== signature) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(signature);
      if (pendingSearch.value.trim()) next.set("q", pendingSearch.value.trim());
      else next.delete("q");
      next.delete("page");
      replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [pendingSearch, signature, pathname, replace]);

  const searchText =
    pendingSearch?.origin === signature ? pendingSearch.value : urlSearchText;

  function updateSearch(value: string) {
    setPendingSearch({ value, origin: signature });
  }

  function changeType(value: BookFilter) {
    setPendingSearch(null);
    push(url({ q: searchText.trim(), type: value, page: 1 }), {
      scroll: false,
    });
  }

  function pageHref(number: number) {
    return url({ ...search, page: number });
  }

  function changePage(number: number) {
    setPendingSearch(null);
    push(pageHref(number), { scroll: false });
  }

  function resetFilters() {
    setPendingSearch(null);
    push(pathname, { scroll: false });
  }

  return {
    search,
    searchText,
    updateSearch,
    changeType,
    changePage,
    resetFilters,
    pageHref,
  };
}
