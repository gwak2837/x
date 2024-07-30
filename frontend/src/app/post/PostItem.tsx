import Link from 'next/link'

type Props = {
  post: Record<string, any>
}

export default function PostItem({ post }: Props) {
  return (
    <Link href={`/post/${post.id}`}>
      <pre className="overflow-x-scroll">{JSON.stringify(post, null, 2)}</pre>
    </Link>
  )
}
