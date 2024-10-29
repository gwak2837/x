import type { FormEvent } from 'react'

import Modal from '@/components/Modal'
import { getUserId, useAuthStore } from '@/model/auth'
import { useFollowStore } from '@/model/follow'
import useFollowMutation from '@/query/useFollowMutation'
import { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  leader: {
    id: string
    name: string
  }
}

export default function FollowButton({ leader }: Props) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const userId = getUserId(accessToken)
  const follow = useFollowStore((state) => state.follow)
  const leaderId = leader.id
  const isFollowing = follow[leaderId]?.[userId]
  const { mutate: followMutation } = useFollowMutation({ leaderId })

  function handleButtonClick() {
    if (!accessToken) {
      toast.error('로그인이 필요합니다')
      return
    }

    if (isFollowing) {
      setIsOpened(true)
      return
    }

    followMutation({ type: 'follow' })
  }

  const [isOpened, setIsOpened] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    followMutation({ type: 'unfollow' })
    setIsOpened(false)
  }

  return (
    <>
      <button
        aria-disabled={!accessToken}
        aria-pressed={isFollowing}
        className="bg-midnight-500 border-midnight-500 aria-pressed:border-midnight-500 whitespace-nowrap rounded-full border px-4 py-2 text-sm text-white aria-disabled:border-gray-500 aria-disabled:bg-gray-500 aria-disabled:text-gray-400 aria-pressed:bg-transparent aria-pressed:text-black aria-pressed:hover:border-red-500 aria-pressed:hover:text-red-500 dark:border-gray-800 aria-pressed:dark:text-white"
        onClick={handleButtonClick}
      >
        {isFollowing ? '팔로잉' : '팔로우'}
      </button>
      <Modal onClose={() => setIsOpened(false)} open={isOpened} showCloseButton showDragButton>
        <form
          className="dark:bg-midnight-900 max-w-96 rounded-3xl bg-white p-8 shadow-xl dark:border"
          onSubmit={handleSubmit}
        >
          <h4 className="pb-2 text-xl font-bold">
            @<span>{leader.name}</span> 님을 언팔로우할까요?
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            이 사용자들의 게시물은 더 이상 추천 타임라인에 표시되지 않습니다. 이러한 사용자의
            프로필은 게시물이 비공개로 설정되지 않는 한 계속 볼 수 있습니다.
          </p>
          <div className="grid gap-3 pt-6">
            <button
              className="bg-midnight-500 rounded-full p-3 font-bold text-white transition hover:brightness-110"
              disabled={!accessToken}
              type="submit"
            >
              언팔로우
            </button>
            <button
              className="rounded-full border p-3 transition hover:bg-gray-200 hover:dark:bg-gray-800"
              disabled={!accessToken}
              onClick={() => setIsOpened(false)}
              type="button"
            >
              취소
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
