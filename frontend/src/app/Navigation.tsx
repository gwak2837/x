import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="flex w-full justify-center gap-2">
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/post">Posts</Link>
      <Link href="/post/create">Create</Link>
    </nav>
  )
}
