import React from "react";

interface ButtonProps {
  type?: "default" | "close" | "primary" | "secondary";
  buttonName?: string;
  onClick?: () => void;
  aria?: string;
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "default",
  buttonName = "Button",
  onClick,
  aria = "아리아를 입력하세요",
  disabled = false,
  bgColor,
  textColor,
}) => {
  const customStyle = {
    backgroundColor: bgColor,
    color: textColor,
  };

  const baseClass = `
    px-4 py-2 rounded text-sm font-medium transition-colors duration-200
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `;

  const typeClassMap: Record<string, string> = {
    default: `
      bg-[var(--color-primary)]
      text-[var(--color-black)]
      hover:bg-[var(--color-gray-300)]
    `,
    close: `
      bg-[var(--color-red)]
      text-white
      hover:bg-red-600
    `,
    primary: `
      bg-[var(--color-blue)]
      text-white
      hover:bg-blue-600
    `,
    secondary: `
      bg-[var(--color-white)]
      text-[var(--color-gray-700)]
      border border-[var(--color-gray-300)]
      hover:bg-[var(--color-gray-100)]
    `,
  };

  const className = `${baseClass} ${typeClassMap[type] ?? ""}`;

  return (
    <button
      aria-label={type === "close" ? "닫기" : aria}
      aria-hidden={disabled}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={bgColor || textColor ? customStyle : undefined}
    >
      {type === "close" ? "닫기" : buttonName}
    </button>
  );
};

export default Button;
