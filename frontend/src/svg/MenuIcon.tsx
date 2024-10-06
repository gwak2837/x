type Props = {
  className?: string
}

export default function MenuIcon({ className }: Props) {
  return (
    <svg
      className={className}
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <line x1="3" x2="21" y1="12" y2="12"></line>
      <line x1="3" x2="21" y1="6" y2="6"></line>
      <line x1="3" x2="21" y1="18" y2="18"></line>
    </svg>
  )
}
