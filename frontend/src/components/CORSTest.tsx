'use client'

import { NEXT_PUBLIC_BACKEND_URL } from '@/common/constants'
import { useState } from 'react'

export default function CORSTest() {
  const [data, setData] = useState('')
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch(NEXT_PUBLIC_BACKEND_URL)
      if (!response.ok) throw new Error('Network response was not ok')
      const result = await response.text()
      setData(result)
      setError(null)
    } catch (error: any) {
      setData('')
      setError(error.message)
    }
  }

  return (
    <div>
      <h1>CORS Test</h1>
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
