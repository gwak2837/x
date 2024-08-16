type Props = {
  className?: string
}

export default function PenIcon({ className }: Props) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="-4 -4 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" fill="currentColor" r="16" stroke="black" strokeWidth="0" />
      <line x1="4" x2="4" y1="3" y2="7" />
      <line x1="2" x2="6" y1="5" y2="5" />
      <path d="M11 20h11" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3L16.5 3.5z" />
    </svg>
  )
}
