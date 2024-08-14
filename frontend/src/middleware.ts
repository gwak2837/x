// https://github.com/vercel/next.js/blob/canary/examples/app-dir-i18n-routing/middleware.ts
import type { NextRequest } from 'next/server'

import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from 'next/server'

export const locales = ['ko', 'en'] as const
export const defaultLocale = locales[0]
export type Locale = (typeof locales)[number]

function getLocale(request: NextRequest) {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => (headers[key] = value))

  const languages = new Negotiator({ headers }).languages(locales as unknown as string[])
  return match(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`

  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    // '/((?!_next).*)',
    // Optional: only run on root (/) URL
    '/',
  ],
}
