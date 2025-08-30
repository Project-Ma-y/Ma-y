// src/layouts/MainLayout.tsx
import React, { useEffect } from "react";
import Header from "@/components/header/Header";
import Navigation from "@/components/Navigation";
import { useUIStore } from "@/store/uiStore";
import clsx from "clsx";

interface MainLayoutProps {
  children: React.ReactNode;
  headerProps?: Record<string, any>;
  className?: string;
  showNav?: boolean;
  /** 이 페이지에서만 폭 제한을 해제하고 전체 폭으로 사용 */
  fullWidth?: boolean;
  /** 섹션 패딩/간격을 페이지별로 제어하고 싶을 때 */
  contentClassName?: string;
}

const MainLayout = ({
  children,
  headerProps,
  className = "",
  showNav = true,
  fullWidth = false,
  contentClassName = "",
}: MainLayoutProps) => {
  const showHeader = headerProps?.showHeader ?? true;

  // 전역 글자 확대
  const large = useUIStore((s) => s.largeTextEnabled);
  useEffect(() => {
    const html = document.documentElement;
    html.style.fontSize = large ? "18px" : "16px";
  }, [large]);

  return (
    // ✅ 루트에서 가로 스크롤 차단
    <div className={clsx("bg-gray-100 w-full min-h-screen overflow-x-hidden", className)}>
      <div
        className={clsx(
          // ✅ 내부도 overflow-x-hidden 유지
          "mx-auto flex flex-col relative w-full bg-white min-h-dvh overflow-x-hidden",
          // ✅ min-w 제거, 작은 화면에서 절대 넘치지 않도록
          fullWidth ? "max-w-none" : "max-w-[520px]"
        )}
      >
        {showHeader && (
          <Header
            {...headerProps}
            fullWidth={fullWidth} // 헤더도 min-w 없이 반응형
          />
        )}

        <section
          className={clsx(
            // ✅ 내용 영역도 가로 스크롤 제거 + 안전한 패딩
            "flex-1 min-h-0 flex flex-col bg-white overflow-x-hidden",
            // spacing: 작은 화면에선 좀 더 타이트하게
            "gap-[clamp(16px,4vw,24px)] px-3 sm:px-5 py-[clamp(16px,4vw,24px)]",
            showNav && "pb-[88px]", // 네비 하단 여백
            contentClassName
          )}
        >
          {children}
        </section>

        {showNav && (
          // ✅ 네비가 뷰포트를 넘지 않도록 고정 폭 + hidden
          <div className="w-full max-w-full overflow-x-hidden">
            <Navigation activePath={window.location.pathname} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
