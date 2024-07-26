import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { FormEvent } from 'react'

export default function PostForm() {
  async function createPost(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
    }

    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/post`, {
      method: 'POST',
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
        <label htmlFor="title" className="block">
          Title
        </label>
        <input type="text" id="title" name="title" className="w-full" />
      </div>
      <div>
        <label htmlFor="content" className="block">
          Content
        </label>
        <textarea id="content" name="content" className="w-full" />
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
