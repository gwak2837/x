import { useState, useEffect } from 'react'

export default function useClientSide() {
  const [isClientSide, setIsClientSide] = useState(false)

  useEffect(() => {
    setIsClientSide(true)
  }, [])

  return isClientSide
}
