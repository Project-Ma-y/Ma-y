import { useState } from 'react'

type Props = { checked?: boolean; onChange?: (v: boolean) => void }

export function Switch({ checked, onChange }: Props) {
  const [local, setLocal] = useState(!!checked)
  const toggle = () => {
    const v = !local
    setLocal(v)
    onChange?.(v)
  }
  return (
    <button onClick={toggle} className={`relative h-6 w-11 rounded-full transition ${local ? 'bg-black' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${local ? 'left-5' : 'left-0.5'}`} />
    </button>
  )
}
