import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ title, description, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center", children: [_jsx("div", { className: "text-base font-semibold", children: title }), description && _jsx("div", { className: "mt-1 text-sm text-gray-600", children: description }), action && _jsx("div", { className: "mt-4", children: action })] }));
}
export default EmptyState;
