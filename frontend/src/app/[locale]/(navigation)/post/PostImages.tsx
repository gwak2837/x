import Image from 'next/image'

type Props = {
  className?: string
  urls: string[]
  imageClassName?: string
}

export default function PostImages({ className = '', imageClassName = '', urls }: Props) {
  const postImageCount = urls.length

  return (
    <div
      className={`grid ${postImageCount > 1 ? 'aspect-video grid-cols-2' : 'w-fit'} ${postImageCount >= 3 ? 'grid-rows-2' : ''} max-w-prose gap-0.5 rounded-2xl ${className}`}
    >
      {urls.map((url) => (
        <Image
          alt="post-image"
          className={`h-full max-h-[512px] object-cover ${postImageCount === 1 ? 'w-full' : ''} ${postImageCount === 3 ? 'first-of-type:row-span-full' : ''} ${imageClassName}`}
          height={512}
          src={url}
          width={650}
        />
      ))}
    </div>
  )
}
