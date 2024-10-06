import { useRef, useState } from 'react'

import useIntersectionObserver from './useIntersectionObserver'

export default function useIsIntersected<T extends HTMLElement>(initialState: boolean) {
  const [isIntersected, setIsIntersected] = useState(initialState)
  const targetRef = useRef<T>(null)

  useIntersectionObserver({
    targetRef,
    onIntersect: () => {
      console.log('👀 ~ onIntersect:')
      setIsIntersected(true)
    },
    onLeave: () => {
      console.log('👀 ~ onLeave:')
      setIsIntersected(false)
    },
  })

  return [isIntersected, targetRef] as const
}
