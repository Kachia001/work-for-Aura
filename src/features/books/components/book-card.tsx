"use client";

import Image from "next/image";
import type { Book } from "@/features/books/types";
import { notifyComingSoon } from "@/lib/coming-soon";

const currency = new Intl.NumberFormat("ko-KR");

export function BookCard({ book }: { book: Book }) {
  const discounted = book.salePrice < book.originalPrice;
  return (
    <article>
      <button
        type="button"
        onClick={notifyComingSoon}
        className="book-card"
        aria-label={`${book.name}, ${currency.format(book.salePrice)}원, 상세 보기`}
      >
        <div className="book-image">
          <Image
            src={book.imagePath}
            alt={book.name}
            fill
            sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 250px"
            className="object-contain"
          />
        </div>
        <div className="book-information">
          <p className="book-type">{book.type === "pass" ? "패스" : "단품"}</p>
          <h2 className="book-title">{book.name}</h2>
          <div className="book-prices">
            {discounted && (
              <p className="book-original">
                <span className="sr-only">정가 </span>
                <s>{currency.format(book.originalPrice)}원</s>
              </p>
            )}
            <p className="book-sale">
              {discounted && (
                <span className="book-discount">
                  {book.discountRate}%<span className="sr-only"> 할인</span>
                </span>
              )}
              <span>
                <span className="sr-only">판매가 </span>
                {currency.format(book.salePrice)}원
              </span>
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}
