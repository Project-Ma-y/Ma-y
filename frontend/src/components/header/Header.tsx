// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/Switch";
import { useUIStore } from "@/store/uiStore";

interface HeaderProps {
  type?: "default" | "header-a" | "header-b";
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ type = "default", title = "" }) => {
  const [pageTitle, setPageTitle] = useState(title);
  const navigate = useNavigate();

  // ✅ 전역 글자 확대 상태
  const isLargeFont = useUIStore((s) => s.largeTextEnabled);
  const toggleLargeText = useUIStore((s) => s.toggleLargeText);

  useEffect(() => {
    if (title) {
      setPageTitle(title);
      return;
    }

    setPageTitle(document.title || "Title");

    const el = document.querySelector("title");
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (!title) {
        setPageTitle(document.title || "Title");
      }
    });

    observer.observe(el, {
      subtree: true,
      characterData: true,
      childList: true,
    });

    // ✅ 정리
    return () => observer.disconnect();
  }, [title]);

  const handleToggleFont = (checked: boolean) => {
    // ✅ 전역 상태 토글 (MainLayout이 반응)
    toggleLargeText(checked);
  };

  return (
    <header className="w-full max-w-[520px] min-w-[390px] mx-auto bg-white px-4 py-3 shadow-md">
      <nav className="flex items-center justify-between">
        {/* 좌측 버튼 (뒤로가기) */}
        {type === "header-a" && (
          <button onClick={() => navigate(-1)} aria-label="뒤로가기">
            <svg
              className="h-6 w-6 text-gray-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* 좌측 로고/타이틀 */}
        {type === "default" && (
          <div className="flex items-center">
            <span className="rounded-md px-2 py-1 text-lg font-extrabold text-[var(--color-primary)]">
              <img src="/public/assets/logo/logo.png" className="w-12" alt="" />
            </span>
          </div>
        )}

        {/* 페이지 타이틀 */}
        {(type === "header-a" || type === "header-b") && (
          <span className="text-lg font-semibold">{pageTitle}</span>
        )}

        {/* 우측 버튼 그룹 */}
        <div className="flex items-center gap-4">
          {/* type이 default일 때만 토글 버튼 */}
          {type === "default" && (
            <Switch label="글씨 확대" checked={isLargeFont} onChange={handleToggleFont} />
          )}

          {/* type이 default일 때만 알림 아이콘 */}
          {type === "default" && (
            <button aria-label="알림" className="relative">
              <svg className="h-5 w-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z" />
              </svg>
            </button>
          )}

          {/* type이 header-b일 때 설정 아이콘 */}
          {type === "header-b" && (
            <button aria-label="설정">
              <svg
                className="h-6 w-6 text-gray-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M21 15h-9" />
                <path d="M12 10h9" />
                <path d="M21 5h-9" />
                <circle cx="7" cy="5" r="2" />
                <circle cx="7" cy="20" r="2" />
                <circle cx="7" cy="10" r="2" />
              </svg>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
