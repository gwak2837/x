import type { ChangeEvent } from 'react'

import IconImage from '@/svg/IconImage'
import toast from 'react-hot-toast'

import PostBaseButton from './PostBaseButton'

const MAX_FILES = 4

type Props = {
  disabled: boolean
  onPreviewImageChange: (previewURLs: string[]) => void
}

export default function PostImageButton({ disabled, onPreviewImageChange }: Props) {
  return (
    <PostBaseButton disabled={disabled}>
      <input
        accept="image/*"
        className="hidden"
        disabled={disabled}
        multiple
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const input = event.target as HTMLInputElement
          const files = input.files

          if (!files) {
            toast.error('파일을 선택해주세요.')
            return
          }

          if (files.length > MAX_FILES) {
            toast.error(`파일 개수는 최대 ${MAX_FILES}개까지 선택할 수 있습니다.`)
            input.value = ''
            return
          }

          onPreviewImageChange(Array.from(files).map((file) => URL.createObjectURL(file)))
        }}
        type="file"
      />
      <IconImage className="w-5" />
    </PostBaseButton>
  )
}
