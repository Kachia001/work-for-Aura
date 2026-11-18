"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BookFilter } from "@/features/books/types";

export function StoreToolbar({
  value,
  type,
  onSearch,
  onType,
}: {
  value: string;
  type: BookFilter;
  onSearch: (value: string) => void;
  onType: (value: BookFilter) => void;
}) {
  return (
    <div className="store-toolbar">
      <div role="search" className="store-search">
        <label htmlFor="book-search" className="sr-only">
          교재 검색
        </label>
        <Search size={18} aria-hidden="true" className="search-icon" />
        <Input
          id="book-search"
          placeholder="검색"
          value={value}
          maxLength={100}
          onChange={(event) => onSearch(event.target.value)}
          className="h-10 rounded-md pr-9 pl-9 text-sm shadow-none"
        />
        <Button
          aria-label="검색어 지우기"
          variant="ghost"
          size="icon-sm"
          onClick={() => onSearch("")}
          className="search-clear"
        >
          <X size={16} />
        </Button>
      </div>
      <div className="store-filters" role="group" aria-label="교재 유형">
        {(
          [
            { value: "all", label: "전체" },
            { value: "pass", label: "패스" },
            { value: "single", label: "단품" },
          ] as const
        ).map((filter) => (
          <button
            key={filter.value}
            aria-pressed={type === filter.value}
            aria-label={filter.label}
            onClick={() => onType(filter.value)}
            className={type === filter.value ? "active" : undefined}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
