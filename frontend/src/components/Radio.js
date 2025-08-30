import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Radio = ({ checked = false, onChange, disabled, id, name, className = "", children, ...rest }) => {
    return (_jsxs("label", { htmlFor: id, className: "inline-flex items-center gap-2 cursor-pointer select-none", children: [_jsx("input", { id: id, name: name, type: "radio", checked: checked, onChange: (e) => onChange?.(e.target.checked), disabled: disabled, className: "peer hidden", ...rest }), _jsx("span", { className: `
          relative flex h-5 w-5 items-center justify-center rounded-full border
          transition-colors duration-200
          ${checked ? "border-[var(--color-primary)]" : "border-gray-400"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `, children: checked && (_jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" })) }), children && _jsx("span", { className: "text-sm font-medium", children: children })] }));
};
export default Radio;
