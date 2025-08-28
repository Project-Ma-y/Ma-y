import { useState } from "react";

type Props = {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export function Switch({ checked, onChange, label, disabled }: Props) {
  const [local, setLocal] = useState(!!checked);

  const toggle = () => {
    if (disabled) return;
    const v = !local;
    setLocal(v);
    onChange?.(v);
  };

  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
          local ? "bg-[var(--color-primary)]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
            local ? "left-5" : "left-0.5"
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  );
}

export default Switch;
