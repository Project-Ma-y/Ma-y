import { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-3xl border border-gray-200 bg-white p-5 shadow-sm', className)} {...rest} />
}

export default Card;