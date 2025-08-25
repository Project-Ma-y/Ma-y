import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  type?: "default" | "header-a" | "header-b";
  icon1?: string;
  icon2?: string;
  icon1OnClick?: () => void;
  icon2OnClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  type = "default",
  icon1 = "center-focus-strong",
  icon2,
  icon1OnClick,
  icon2OnClick,
  title,
}) => {
  const [pageTitle, setPageTitle] = useState(title || "Title");
  const navigate = useNavigate();

  useEffect(() => {
    if (title) {
      setPageTitle(title);
      return;
    }

    setPageTitle(document.title || "Title");

    const observer = new MutationObserver(() => {
      if (!title) {
        setPageTitle(document.title || "Title");
      }
    });

    observer.observe(document.querySelector("title")!, {
      subtree: true,
      characterData: true,
      childList: true,
    });
  }, [title]);

  const handleIconClick = (icon: string, customHandler?: () => void) => {
    if (icon === "arrow-left") {
      return () => navigate(-1);
    }
    return customHandler;
  };

  return (
    <header className="w-full max-w-[520px] min-w-[390px] mx-auto bg-white px-4 py-3 shadow-md">
      <nav className="flex items-center justify-between">
        {/* header-b 타입: 뒤로가기 + 타이틀 */}
        {type === "header-b" && (
          <div className="flex items-center gap-2">
            <div
              onClick={() => navigate(-1)}
              className="w-6 h-6 bg-gray-300 rounded cursor-pointer"
            ></div>
            <span className="text-lg font-semibold">{pageTitle}</span>
          </div>
        )}

        {/* default / header-a 타입 */}
        {(type === "default" || type === "header-a") && (
          <>
            <div className="flex items-center">
              {type === "default" ? (
                <div className="w-24 h-8 bg-gray-300" />
              ) : (
                <span className="text-lg font-semibold">{pageTitle}</span>
              )}
            </div>

            <ul className="flex gap-2 items-center">
              {icon1 && (
                <li>
                  <div
                    onClick={handleIconClick(icon1, icon1OnClick)}
                    className="w-6 h-6 bg-gray-300 rounded cursor-pointer"
                  />
                </li>
              )}
              {icon2 && (
                <li>
                  <div
                    onClick={handleIconClick(icon2, icon2OnClick)}
                    className="w-6 h-6 bg-gray-300 rounded cursor-pointer"
                  />
                </li>
              )}
            </ul>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
