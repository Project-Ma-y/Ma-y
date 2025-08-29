import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { pageList } from '../config';
const PageList = () => {
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "\uD83D\uDCC4 Page List" }), _jsx("ul", { className: "space-y-2", children: pageList.map((page) => (_jsx("li", { children: _jsx("a", { href: page.path, target: "_blank", rel: "noopener noreferrer", className: "text-blue-500 underline", children: page.name }) }, page.path))) })] }));
};
export default PageList;
