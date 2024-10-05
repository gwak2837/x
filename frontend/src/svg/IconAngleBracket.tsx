type Props = {
  className?: string
}

export default function IconAngleBracket({ className, ...props }: Props) {
  return (
    <svg
      {...props}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  )
}