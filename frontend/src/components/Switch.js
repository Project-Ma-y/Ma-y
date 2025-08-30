import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function Switch({ checked, onChange, label, disabled }) {
    const [local, setLocal] = useState(!!checked);
    const toggle = () => {
        if (disabled)
            return;
        const v = !local;
        setLocal(v);
        onChange?.(v);
    };
    return (_jsxs("label", { className: `inline-flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`, children: [_jsx("button", { type: "button", onClick: toggle, disabled: disabled, className: `relative h-6 w-11 rounded-full transition-colors duration-200 ${local ? "bg-[var(--color-primary)]" : "bg-gray-300"}`, children: _jsx("span", { className: `absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${local ? "left-5" : "left-0.5"}` }) }), label && _jsx("span", { className: "text-sm font-medium", children: label })] }));
}
export default Switch;
