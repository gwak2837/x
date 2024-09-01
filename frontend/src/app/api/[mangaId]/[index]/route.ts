import type { NextRequest } from 'next/server'

import { HASHA_CDN_DOMAIN } from '@/common/constants'
import { NextResponse } from 'next/server'

type Params = {
  params: {
    mangaId: string
    index: string
  }
}

export const GET = async (_: NextRequest, { params }: Params) => {
  const { mangaId, index } = params
  const res = await fetch(`${HASHA_CDN_DOMAIN}/${mangaId}/${index}.webp`)

  const blob = await res.arrayBuffer()

  const headers = new Headers(res.headers)
  headers.delete('do-we-love-hasha')
  headers.delete('server')
  headers.delete('set-cookie')
  headers.delete('vary')

  return new NextResponse(blob, { headers })
}