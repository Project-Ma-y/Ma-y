import React from "react";

type Props = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
};

const Radio: React.FC<Props> = ({
  checked = false,
  onChange,
  disabled,
  id,
  name,
  className = "",
  children,
  ...rest
}) => {
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
    >
      <input
        id={id}
        name={name}
        type="radio"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="peer hidden"
        {...rest}
      />
      <span
        className={`
          relative flex h-5 w-5 items-center justify-center rounded-full border
          transition-colors duration-200
          ${checked ? "border-[var(--color-primary)]" : "border-gray-400"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        {/* 선택 시 내부 원 */}
        {checked && (
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
        )}
      </span>
      {children && <span className="text-sm font-medium">{children}</span>}
    </label>
  );
};

export default Radio;
