import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Input = ({ label, helpText, ...rest }) => {
    return (_jsxs("div", { className: "w-full", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: label }), _jsx("input", { className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFB014] focus:border-transparent transition duration-200", ...rest }), helpText && (_jsx("p", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: helpText }))] }));
};
export default Input;
