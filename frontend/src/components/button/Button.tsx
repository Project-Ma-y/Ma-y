// src/components/button/Button.tsx
import React from "react";

interface ButtonProps {
  type?: "default" | "close" | "primary" | "secondary";
  buttonName?: string;
  onClick?: () => void;
  aria?: string;
  disabled?: boolean;
  bgColor?: string;   // (옵션) 외부에서 강제 색상 오버라이드
  textColor?: string; // (옵션) 외부에서 강제 색상 오버라이드
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "default",
  buttonName = "button",
  onClick,
  aria = "버튼",
  disabled = false,
  bgColor,
  textColor,
  className = "",
}) => {
  const base =
    "inline-flex items-center justify-center px-8 py-3 rounded-2xl text-base font-bold transition-colors duration-200 " +
    (disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer");

  // --color-primary: #f7b349 (전역에 선언되어 있다고 가정)
  const byType: Record<string, string> = {
    // 채움(상단 이미지)
    default: "bg-[var(--color-primary)] text-white hover:opacity-90",
    // 회색(중간 이미지)
    close: "bg-[#9a9a9a] text-[#cdcdcd]",
    // 필요 시 default와 동일하게 사용
    primary: "bg-[var(--color-primary)] text-white hover:opacity-90",
    // 아웃라인(하단 이미지)
    secondary:
      "bg-white text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[rgba(247,179,73,0.06)]",
  };

  const customStyle =
    bgColor || textColor
      ? ({
          backgroundColor: bgColor,
          color: textColor,
        } as React.CSSProperties)
      : undefined;

  return (
    <button
      aria-label={type === "close" ? "닫기" : aria}
      aria-hidden={disabled}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${byType[type] ?? ""} ${className}`}
      style={customStyle}
    >
      {type === "close" ? "동행완료" : buttonName}
    </button>
  );
};

export default Button;
