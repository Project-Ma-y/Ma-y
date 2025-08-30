// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/Switch";
import { useUIStore } from "@/store/uiStore";
import logoUrl from "/assets/logo/logo.png";

interface HeaderProps {
  type?: "default" | "header-a" | "header-b";
  title?: string;
  fullWidth?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  type = "default",
  title = "",
  fullWidth = false,
}) => {
  const [pageTitle, setPageTitle] = useState(title);
  const navigate = useNavigate();

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
    return () => observer.disconnect();
  }, [title]);

  const handleToggleFont = (checked: boolean) => {
    toggleLargeText(checked);
  };

  // ✅ 반응형: 모바일(<=375px)에서는 min-w 제거
  const innerWidthClass = fullWidth
    ? "w-full"
    : "w-full max-w-[520px] mx-auto px-2 sm:px-4"; 
    // min-w 제거, 대신 padding으로 여백 확보

  return (
    <header className="w-full bg-white px-2 sm:px-4 py-3 shadow-md overflow-x-hidden">
      <div className={innerWidthClass}>
        <nav className="flex items-center justify-between">
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

          {type === "default" && (
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="rounded-md px-1 sm:px-2 py-1 text-lg font-extrabold text-[var(--color-primary)]"
              >
                <img src={logoUrl} alt="logo" className="w-10 sm:w-12" />
              </button>
            </div>
          )}

          {(type === "header-a" || type === "header-b") && (
            <span className="text-base sm:text-lg font-semibold truncate max-w-[60%]">
              {pageTitle}
            </span>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            {type === "default" && (
              <Switch
                label="글씨 확대"
                checked={isLargeFont}
                onChange={handleToggleFont}
              />
            )}
            {type === "default" && (
              <button aria-label="알림" className="relative">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z" />
                </svg>
              </button>
            )}
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
      </div>
    </header>
  );
};

export default Header;
