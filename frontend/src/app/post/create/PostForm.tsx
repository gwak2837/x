'use client'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { useAuthStore } from '@/zustand/auth'
import { FormEvent } from 'react'

export default function PostForm() {
  const accessToken = useAuthStore((state) => state.accessToken)

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = {
      content: formData.get('content'),
    }

    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status >= 500) throw new Error(await response.text())
    if (response.status >= 400) return await response.text()

    const newPost = await response.json()
    console.log('👀 - newPost:', newPost)
    return newPost
  }

  return (
    <form className="space-y-4" onSubmit={createPost}>
      <div>
        <label className="block" htmlFor="title">
          Title
        </label>
        <input className="w-full bg-slate-500" id="title" name="title" type="text" />
      </div>
      <div>
        <label className="block" htmlFor="content">
          Content
        </label>
        <textarea className="w-full bg-slate-500" id="content" name="content" />
      </div>
      <button className="bg-blue-500 text-white" type="submit">
        Submit
      </button>
    </form>
  )
}

async function createPost() {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`, { method: 'POST' })
  if (response.status >= 500) throw new Error(await response.text())
  if (response.status >= 400) return await response.text()

  const posts = await response.json()
  return posts
}
