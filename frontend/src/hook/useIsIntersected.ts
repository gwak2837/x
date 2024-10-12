import { useRef, useState } from 'react'

import useIntersectionObserver from './useIntersectionObserver'

export default function useIsIntersected<T extends HTMLElement>(initialState: boolean) {
  const [isIntersected, setIsIntersected] = useState(initialState)
  const targetRef = useRef<T>(null)

  useIntersectionObserver({
    targetRef,
    onIntersect: () => setIsIntersected(true),
    onLeave: () => setIsIntersected(false),
  })

  return [isIntersected, targetRef] as const
}
