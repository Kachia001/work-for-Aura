"use client";

import { notifyComingSoon } from "@/lib/coming-soon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="store-container">
        <nav aria-label="회사 및 약관" className="footer-links">
          {["회사소개", "이용약관", "개인정보처리방침"].map((label) => (
            <button key={label} onClick={notifyComingSoon}>
              {label}
            </button>
          ))}
        </nav>
        <div className="footer-information">
          <p>
            (주)히든카이스 | 대표: 안영호 | 사업자등록번호: 735-87-02522{" "}
            <button onClick={notifyComingSoon}>(사업자정보확인)</button>
          </p>
          <p>
            주소: 경기도 고양시 일산서구 일현로 97-11, 56F | 통신판매업
            신고번호: 제 2024-고양일산서-1209
          </p>
          <p>Copyright © 2026 히든카이스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
