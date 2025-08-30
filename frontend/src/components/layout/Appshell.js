import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
export function AppShell({ children }) {
    return (_jsxs("div", { className: "grid min-h-screen grid-cols-[220px_1fr] bg-gray-50", children: [_jsxs("aside", { className: "border-r bg-white p-4", children: [_jsx("div", { className: "mb-6 text-lg font-bold", children: "Admin" }), _jsxs("nav", { className: "flex flex-col gap-1", children: [_jsx(NavLink, { to: "/", className: "rounded-xl px-3 py-2 hover:bg-gray-100", children: "\uB300\uC2DC\uBCF4\uB4DC" }), _jsx(NavLink, { to: "/users", className: "rounded-xl px-3 py-2 hover:bg-gray-100", children: "\uD68C\uC6D0" }), _jsx(NavLink, { to: "/posts", className: "rounded-xl px-3 py-2 hover:bg-gray-100", children: "\uAC8C\uC2DC\uBB3C" })] })] }), _jsx("main", { className: "p-6", children: children })] }));
}
export default AppShell;
