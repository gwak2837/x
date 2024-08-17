'use client'

type Props = {
  className?: string
  selected: boolean
}

export default function BookmarkIcon({ className, selected }: Props) {
  return (
    <svg
      className={className}
      fill={selected ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}
