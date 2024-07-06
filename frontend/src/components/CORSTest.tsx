'use client'

import { useState } from 'react'

export default function CORSTest() {
  const [data, setData] = useState('')
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000')
      if (!response.ok) throw new Error('Network response was not ok')
      const result = await response.text()
      setData(result)
      setError(null)
    } catch (err: any) {
      setData('')
      setError(err.message)
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
