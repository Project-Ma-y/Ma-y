// src/components/TagList.tsx
import React, { useEffect, useState } from "react"

type Props = {
  /** 표시할 태그 목록 */
  tags: string[]
  /** 선택된 값 (제어 컴포넌트) */
  value?: string[]
  /** 선택 변경 콜백 */
  onChange?: (next: string[]) => void
  /** 다중 선택 여부 (기본: true) */
  multiple?: boolean
  /** 비활성화 */
  disabled?: boolean
  /** 외부 클래스 병합 */
  className?: string
}

const TagList: React.FC<Props> = ({
  tags,
  value = [],
  onChange,
  multiple = true,
  disabled = false,
  className = "",
}) => {
  const [active, setActive] = useState<string[]>(value)

  useEffect(() => setActive(value), [value.join("|")]) // shallow sync

  const toggle = (tag: string) => {
    if (disabled) return
    let next: string[]
    if (multiple) {
      next = active.includes(tag) ? active.filter((t) => t !== tag) : [...active, tag]
    } else {
      next = active.includes(tag) ? [] : [tag]
    }
    setActive(next)
    onChange?.(next)
  }

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => {
        const isOn = active.includes(tag)
        return (
          <li key={tag}>
            <button
              type="button"
              onClick={() => toggle(tag)}
              aria-pressed={isOn}
              disabled={disabled}
              className={[
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                "border",
                disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                isOn
                  ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
              ].join(" ")}
            >
              {tag}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default TagList
