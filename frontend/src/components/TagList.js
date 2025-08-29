import { jsx as _jsx } from "react/jsx-runtime";
// src/components/TagList.tsx
import { useEffect, useState } from "react";
const TagList = ({ tags, value = [], onChange, multiple = true, disabled = false, className = "", }) => {
    const [active, setActive] = useState(value);
    useEffect(() => setActive(value), [value.join("|")]); // shallow sync
    const toggle = (tag) => {
        if (disabled)
            return;
        let next;
        if (multiple) {
            next = active.includes(tag) ? active.filter((t) => t !== tag) : [...active, tag];
        }
        else {
            next = active.includes(tag) ? [] : [tag];
        }
        setActive(next);
        onChange?.(next);
    };
    return (_jsx("ul", { className: `flex flex-wrap gap-2 ${className}`, children: tags.map((tag) => {
            const isOn = active.includes(tag);
            return (_jsx("li", { children: _jsx("button", { type: "button", onClick: () => toggle(tag), "aria-pressed": isOn, disabled: disabled, className: [
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        "border",
                        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                        isOn
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
                    ].join(" "), children: tag }) }, tag));
        }) }));
};
export default TagList;
