import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Checkbox({ className, ...rest }: Props) {
  return (
    <input type="checkbox" className={clsx('h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20', className)} {...rest} />
  )
}
