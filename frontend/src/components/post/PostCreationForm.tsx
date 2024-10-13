import type { TAuthor } from '@/mock/post'

import { THEME_COLOR } from '@/common/constants'
import IconImage from '@/svg/IconImage'
import TextareaAutosize from 'react-textarea-autosize'

import Squircle from '../Squircle'

type Props = {
  className?: string
  author?: TAuthor
  placeholder?: string
  buttonText?: string
}

export default function PostCreationForm({
  className,
  author,
  placeholder,
  buttonText = '게시하기',
}: Props) {
  return (
    <form className="grid grid-cols-[auto_1fr] gap-2" onSubmit={(e) => e.preventDefault()}>
      <Squircle
        className="text-white"
        fill={THEME_COLOR}
        src={author?.profileImageURLs?.[0]}
        wrapperClassName="w-10 flex-shrink-0"
      >
        {author?.nickname.slice(0, 2)}
      </Squircle>
      <div className="grid gap-4">
        <div>asdf</div>
        <TextareaAutosize
          className="h-7 w-full resize-none text-xl focus:outline-none"
          maxRows={25}
          onKeyDown={(e) => {
            console.log(e.key)
          }}
          placeholder={placeholder}
          required
        />
        <div className="flex justify-between gap-2 pt-1">
          <div>
            <IconImage className="w-4" />
          </div>
          <div className="flex items-center gap-3">
            <div>O</div>
            <button className="bg-midnight-500 rounded-full px-4 py-2">{buttonText}</button>
          </div>
        </div>
      </div>
    </form>
  )
}
