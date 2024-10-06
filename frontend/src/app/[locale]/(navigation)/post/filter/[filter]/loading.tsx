import { PostSkeleton } from '../../PostItem'

export default function Loading() {
  return (
    <>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <PostSkeleton key={i} />
        ))}
    </>
  )
}
