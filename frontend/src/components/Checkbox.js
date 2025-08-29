import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Checkbox = ({ checked = false, onChange, disabled, id, name, className = "", children, ...rest }) => {
    return (_jsxs("label", { htmlFor: id, className: "inline-flex items-center gap-2 cursor-pointer select-none", children: [_jsx("input", { id: id, name: name, type: "checkbox", checked: checked, onChange: (e) => onChange?.(e.target.checked), disabled: disabled, className: "peer hidden", ...rest }), _jsx("span", { className: `
          flex h-5 w-5 items-center justify-center rounded-md border
          transition-colors duration-200
          ${checked ? "bg-[var(--color-primary)] border-[var(--color-primary)]" : "border-gray-400 bg-white"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `, children: checked && (_jsx("svg", { className: "h-3.5 w-3.5 text-white", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z", clipRule: "evenodd" }) })) }), children && _jsx("span", { className: "text-sm font-medium", children: children })] }));
};
export default Checkbox;
