"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, ShoppingCart, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { notifyComingSoon } from "@/lib/coming-soon";

const menus = ["스토어", "AI OMR WORK", "챌린지", "히든카이스 소개"];

export function SiteHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="store-container header-inner">
        <Link
          href="/store"
          aria-label="히든카이스 스토어 홈"
          className="shrink-0"
        >
          <Image
            src="/images/logo.svg"
            width={144}
            height={18}
            alt="HIDDEN KICE"
            priority
          />
        </Link>
        <nav aria-label="주 메뉴" className="desktop-navigation">
          {menus.map((menu, index) =>
            index === 0 ? (
              <Link
                href="/store"
                aria-current="page"
                key={menu}
                className="active"
              >
                {menu}
              </Link>
            ) : (
              <button key={menu} onClick={notifyComingSoon}>
                {menu}
              </button>
            ),
          )}
        </nav>
        <div className="header-actions">
          {[
            { Icon: ShoppingCart, label: "장바구니" },
            { Icon: Bell, label: "알림" },
            { Icon: UserRound, label: "마이페이지" },
          ].map(({ Icon, label }) => (
            <Button
              key={label}
              size="icon"
              variant="ghost"
              aria-label={label}
              onClick={notifyComingSoon}
              className="header-icon"
            >
              <Icon aria-hidden="true" />
            </Button>
          ))}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="mobile-menu"
                  aria-label="메뉴 열기"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>히든카이스</SheetTitle>
                <SheetDescription>메뉴를 선택해 주세요.</SheetDescription>
              </SheetHeader>
              <nav
                aria-label="모바일 주 메뉴"
                className="flex flex-col gap-2 px-4"
              >
                {menus.map((menu, index) => (
                  <Button
                    key={menu}
                    variant="ghost"
                    className="justify-start"
                    onClick={
                      index === 0
                        ? () => {
                            router.push("/store");
                            setMenuOpen(false);
                          }
                        : notifyComingSoon
                    }
                  >
                    {menu}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
