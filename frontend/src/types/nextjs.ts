import type { Locale } from '@/middleware'

import { type ReactNode } from 'react'

export type LayoutProps<
  Slot extends Record<string, ReactNode> = Record<string, ReactNode>,
  Param extends Record<string, unknown> = Record<string, string>,
> = {
  children: ReactNode
  params: { locale: Locale } & Param
} & Slot

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
