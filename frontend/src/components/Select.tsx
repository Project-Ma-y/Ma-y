import { SelectHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type Props = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }

export const Select = forwardRef<HTMLSelectElement, Props>(({ className, invalid, children, ...rest }, ref) => {
  return (
    <select
      ref={ref}
      className={clsx(
        'h-10 w-full rounded-2xl border bg-white px-3 text-sm outline-none transition',
        invalid ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-black/20',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  )
})
Select.displayName = 'Select'
