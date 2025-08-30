import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import clsx from "clsx";
export const Select = forwardRef(({ className, invalid, children, ...rest }, ref) => {
    return (_jsxs("div", { className: "relative w-full", children: [_jsx("select", { ref: ref, className: clsx("h-12 w-full appearance-none rounded-2xl border px-4 pr-10 text-sm font-medium outline-none transition", invalid
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30", "bg-white text-gray-800", className), ...rest, children: children }), _jsx("svg", { className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" }) })] }));
});
Select.displayName = "Select";
export default Select;
