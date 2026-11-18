"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export function StorePagination({
  page,
  totalPages,
  href,
  onPage,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
  onPage: (page: number) => void;
}) {
  if (totalPages < 1) return null;
  const pages = Array.from(
    { length: Math.min(5, totalPages) },
    (_, index) => Math.max(1, Math.min(page - 2, totalPages - 4)) + index,
  );
  const item = (
    target: number,
    label: string,
    content: React.ReactNode,
    disabled = false,
  ) => (
    <PaginationItem key={label}>
      <PaginationLink
        href={href(target)}
        aria-label={label}
        role="link"
        isActive={target === page && typeof content === "number"}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={(event) => {
          event.preventDefault();
          if (!disabled) onPage(target);
        }}
        className="store-page"
      >
        {content}
      </PaginationLink>
    </PaginationItem>
  );
  return (
    <Pagination aria-label="교재 목록 페이지" className="store-pagination">
      <PaginationContent>
        {item(
          Math.max(1, page - 1),
          "이전 페이지",
          <ChevronLeft />,
          page === 1,
        )}
        {pages.map((number) => item(number, `${number}페이지`, number))}
        {item(
          Math.min(totalPages, page + 1),
          "다음 페이지",
          <ChevronRight />,
          page >= totalPages,
        )}
      </PaginationContent>
    </Pagination>
  );
}
