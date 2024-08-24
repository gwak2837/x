'use client'

import { type ChangeEvent, type ReactNode, useEffect, useState } from 'react'

type Props = {
  children: ReactNode[]
  className?: string
}

export default function Drawer({ className, children }: Props) {
  const [isOpened, setIsOpened] = useState(false)

  function openDrawer() {
    setIsOpened(true)
    const bodyStyle = document.body.style
    bodyStyle.overflow = 'hidden'
    bodyStyle.pointerEvents = 'none'
    bodyStyle.touchAction = 'none'
    bodyStyle.transform = 'translateX(80%)'
  }

  function closeDrawer() {
    setIsOpened(false)
    const bodyStyle = document.body.style
    bodyStyle.overflow = ''
    bodyStyle.pointerEvents = ''
    bodyStyle.touchAction = ''
    bodyStyle.transform = ''
  }

  function handleChange(e: ChangeEvent) {
    if ((e.target as HTMLInputElement).checked) {
      openDrawer()
    } else {
      closeDrawer()
    }
  }

  useEffect(() => {
    function closeOnEscapeKey(e: KeyboardEvent) {
      if (e.code === 'Escape') {
        closeDrawer()
      }
    }

    document.addEventListener('keydown', closeOnEscapeKey, false)

    return () => {
      document.removeEventListener('keydown', closeOnEscapeKey, false)
    }
  }, [])

  return (
    <>
      <label className={'peer relative ' + className}>
        <input
          checked={isOpened}
          className="hover:bg-midnight-500/10 hover:dark:bg-midnight-500/40 peer absolute inset-0 appearance-none overflow-hidden rounded-full transition-colors"
          onChange={handleChange}
          type="checkbox"
        />
        <div className="transition peer-checked:translate-x-0 peer-checked:opacity-0">
          {children[0]}
        </div>
      </label>
      <div
        className="pointer-events-none fixed inset-0 z-50 h-dvh bg-black/25 opacity-0 transition duration-300 peer-has-[:checked]:pointer-events-auto peer-has-[:checked]:opacity-100 dark:bg-white/25"
        onClick={closeDrawer}
      />
      <div className="pointer-events-auto fixed inset-0 h-dvh w-4/5 -translate-x-full transition">
        {children[1]}
      </div>
    </>
  )
}
