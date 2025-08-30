// src/components/SoftSection.tsx
import React from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  children: React.ReactNode;
  /** 하단 선/그라데이션 표시 여부 (기본 true) */
  divider?: boolean;
};

const SoftSection: React.FC<Props> = ({ className, children, divider = true }) => {
  return (
    <section
      className={clsx(
        "relative w-full px-6 pb-6",
        divider && [
          "before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gray-200",
          "after:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-3 after:bg-gradient-to-b after:from-gray-300/40 after:to-white",
        ],
        className
      )}
    >
      {children}
    </section>
  );
};

export default SoftSection;
