import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Header.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "@/components/Switch";
import { useUIStore } from "@/store/uiStore";
const Header = ({ type = "default", title = "" }) => {
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
        if (!el)
            return;
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
    const handleToggleFont = (checked) => {
        // ✅ 전역 상태 토글 (MainLayout이 반응)
        toggleLargeText(checked);
    };
    return (_jsx("header", { className: "w-full max-w-[520px] min-w-[390px] mx-auto bg-white px-4 py-3 shadow-md", children: _jsxs("nav", { className: "flex items-center justify-between", children: [type === "header-a" && (_jsx("button", { onClick: () => navigate(-1), "aria-label": "\uB4A4\uB85C\uAC00\uAE30", children: _jsx("svg", { className: "h-6 w-6 text-gray-800", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M15 18l-6-6 6-6" }) }) })), type === "default" && (_jsx("div", { className: "flex items-center", children: _jsx("span", { className: "rounded-md px-2 py-1 text-lg font-extrabold text-[var(--color-primary)]", children: _jsx("img", { src: "/public/assets/logo/logo.png", className: "w-12", alt: "" }) }) })), (type === "header-a" || type === "header-b") && (_jsx("span", { className: "text-lg font-semibold", children: pageTitle })), _jsxs("div", { className: "flex items-center gap-4", children: [type === "default" && (_jsx(Switch, { label: "\uAE00\uC528 \uD655\uB300", checked: isLargeFont, onChange: handleToggleFont })), type === "default" && (_jsx("button", { "aria-label": "\uC54C\uB9BC", className: "relative", children: _jsx("svg", { className: "h-5 w-5 text-gray-800", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M12 2a6 6 0 0 0-6 6v3.586l-1.707 1.707A1 1 0 0 0 5 15h14a1 1 0 0 0 .707-1.707L18 11.586V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z" }) }) })), type === "header-b" && (_jsx("button", { "aria-label": "\uC124\uC815", children: _jsxs("svg", { className: "h-6 w-6 text-gray-800", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M12 20h9" }), _jsx("path", { d: "M21 15h-9" }), _jsx("path", { d: "M12 10h9" }), _jsx("path", { d: "M21 5h-9" }), _jsx("circle", { cx: "7", cy: "5", r: "2" }), _jsx("circle", { cx: "7", cy: "20", r: "2" }), _jsx("circle", { cx: "7", cy: "10", r: "2" })] }) }))] })] }) }));
};
export default Header;
