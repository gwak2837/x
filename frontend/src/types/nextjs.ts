import type { Locale } from '@/middleware'

import { type ReactNode } from 'react'

export type LayoutProps<T extends Record<string, unknown> = Record<string, string>> = {
  children: ReactNode
  params: { locale: Locale } & T
}

export type PageProps<T extends Record<string, unknown> = Record<string, string>> = {
  params: { locale: Locale } & T
  searchParams: Record<string, string | string[] | undefined>
}

export type ErrorProps = {
  error: {
    digest?: string
  } & Error
  reset: () => void
}

export type RouteProps = {
  params: Record<string, string>
}

export type Params = {
  lang: Locale
  postId: string
  questionCount: string
}
