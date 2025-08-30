// src/components/Modal.tsx
import type { ReactNode } from "react";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/button/Button";
import { useUIStore } from "@/store/uiStore";

type Variant = "success" | "warning" | "notice";

type BaseProps = {
  id: string;
  variant: Variant;
  title?: string;
  subtext?: string;
  children?: ReactNode;       // notice 설명 등 커스텀 콘텐츠
  confirmText?: string;       // 버튼 텍스트 (기본: button)
  onConfirm?: () => void;     // 확인 클릭
  showCancel?: boolean;       // cancel 버튼 노출 여부
  cancelText?: string;        // 취소 텍스트
};

type NoticeExtra = {
  /** 체크박스 문구. 설정하면 체크해야 버튼 활성화됨 */
  acknowledgeLabel?: string;
};

export function Modal({
  id,
  variant,
  title = "title",
  subtext = "subtext",
  children,
  confirmText = "button",
  onConfirm,
  showCancel = false,
  cancelText = "취소",
  acknowledgeLabel,
}: BaseProps & Partial<NoticeExtra>) {
  const isOpen = useUIStore((s) => s.isModalOpen(id));
  const close = useUIStore((s) => s.closeModal);

  const [ack, setAck] = useState(false);
  const requireAck = variant === "notice" && !!acknowledgeLabel;

  if (!isOpen) return null;

  const Icon = () => {
    if (variant === "success") {
      return (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]">
          {/* check */}
          <svg className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 0 0-1.414 0L8 12.586 4.707 9.293a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0 0-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      );
    }
    // warning + notice -> 동일한 느낌의 느낌표
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FF5A36]">
        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 6h2v8h-2zM11 16h2v2h-2z" />
        </svg>
      </span>
    );
  };

  const Card = ({ children: c }: { children: ReactNode }) => (
    <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-4">
      <div className="rounded-2xl bg-gray-100 p-6 shadow-[0_2px_0_#e5e5e5_inset]">
        {c}
      </div>
    </div>
  );

  const handleConfirm = () => {
    onConfirm?.();
    close(id);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => close(id)} />
      <Card>
        <div className="flex flex-col items-center text-center gap-4">
          <Icon />
          <div>
            <div className="text-2xl font-bold">{title}</div>
            {subtext && <div className="mt-1 text-sm text-gray-500">{subtext}</div>}
          </div>

          {/* notice 전용 본문 영역 */}
          {variant === "notice" && (
            <div className="mt-2 text-gray-600">
              {children}
              {acknowledgeLabel && (
                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-400"
                    checked={ack}
                    onChange={(e) => setAck(e.target.checked)}
                  />
                  {acknowledgeLabel}
                </label>
              )}
            </div>
          )}

          {/* footer */}
          <div className="mt-2 flex w-full items-center justify-center gap-3">
            {showCancel && (
              <Button type="secondary" buttonName={cancelText} onClick={() => close(id)} />
            )}
            <Button
              type={variant === "warning" ? "primary" : "default"}
              buttonName={confirmText}
              onClick={handleConfirm}
              disabled={requireAck && !ack}
              className={variant === "notice" ? "bg-[#8B8B8B] text-[#CDCDCD] border-none data-[enabled=true]:bg-[var(--color-primary)] data-[enabled=true]:text-white" : ""}
            />
          </div>
        </div>
      </Card>
    </div>,
    document.body
  );
}

export default Modal;
