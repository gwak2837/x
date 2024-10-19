import type { Locale } from '@/middleware'

import { type ReactNode } from 'react'

export type BaseLayoutProps<Param extends Record<string, unknown> = Record<string, string>> = {
  children: ReactNode
  params: { locale: Locale } & Param
}

export type BasePageProps<T extends Record<string, unknown> = Record<string, string>> = {
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

export type BaseParams = {
  locale: Locale
}

export type PostParams = {
  postId: string
  questionCount: string
} & BaseParams
