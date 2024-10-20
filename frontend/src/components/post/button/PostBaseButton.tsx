import type { ReactNode } from 'react'

type Props = {
  disabled: boolean
  children: ReactNode
  onClick?: () => void
}

export default function PostBaseButton({ disabled, children, onClick }: Props) {
  return (
    <label
      aria-disabled={disabled}
      className="hover:bg-midnight-500/20 hover:dark:bg-midnight-500/50 h-fit rounded-full p-2 transition aria-disabled:cursor-not-allowed aria-disabled:text-gray-500 hover:aria-disabled:bg-transparent hover:aria-disabled:dark:bg-transparent"
      onClick={onClick}
    >
      {children}
    </label>
  )
}
