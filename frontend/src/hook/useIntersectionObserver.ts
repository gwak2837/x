import type { RefObject } from 'react'

import { useEffect, useRef } from 'react'

type Params = {
  targetRef: RefObject<HTMLElement | null>
  onIntersect: () => void
  onLeave?: () => void
  root?: HTMLElement | null
  rootMargin?: string
}

export default function useIntersectionObserver({
  targetRef,
  onIntersect,
  onLeave,
  root,
  rootMargin,
}: Params) {
  const observerRef = useRef(
    globalThis.window?.IntersectionObserver &&
      new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.ariaCurrent = 'true'
              onIntersect()
            } else {
              if (entry.target.ariaCurrent === 'true') {
                onLeave?.()
                entry.target.removeAttribute('aria-current')
              }
            }
          }),
        { root, rootMargin },
      ),
  )

  useEffect(() => {
    const target = targetRef.current
    const observer = observerRef.current

    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [targetRef])
}
