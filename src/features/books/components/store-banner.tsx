"use client";

import Image from "next/image";
import { notifyComingSoon } from "@/lib/coming-soon";

export function StoreBanner() {
  return (
    <section aria-label="히든카이스 시리즈 소개" className="store-banner">
      <Image
        src="/images/store-banner.png"
        width={1440}
        height={490}
        alt="히든카이스, 모두가 푸는 건 이유가 있습니다. 실전 적중, 난이도별 구성, 검증된 결과."
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
      <button
        className="banner-link"
        aria-label="히든카이스 시리즈 보기"
        onClick={notifyComingSoon}
      />
    </section>
  );
}
