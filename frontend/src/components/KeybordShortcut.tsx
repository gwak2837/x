'use client'

import { type ReactNode, useEffect } from 'react'

type Props = {
  children: ReactNode
  keyCode: string
  onKeyDown?: () => void
}

export default function KeybordShortcut({ children, keyCode, onKeyDown }: Props) {
  useEffect(() => {
    function downHandler({ code, altKey }: KeyboardEvent) {
      if (altKey && keyCode === code) {
        onKeyDown?.()
      }
    }

    document.addEventListener('keydown', downHandler)
    return () => {
      document.removeEventListener('keydown', downHandler)
    }
  }, [keyCode, onKeyDown])

  return <>{children}</>
}
