import type { LayoutProps } from '@/types/nextjs'
import type { Metadata, Viewport } from 'next'

import {
  APPLICATION_NAME,
  APPLICATION_SHORT_NAME,
  AUTHOR,
  CANONICAL_URL,
  CATEGORY,
  DESCRIPTION,
  KEYWORDS,
  THEME_COLOR,
} from '@/common/constants'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import { defaultLocale, locales } from '@/middleware'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'

import Authentication from './Authentication'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  title: APPLICATION_NAME,
  description: DESCRIPTION,
  applicationName: APPLICATION_SHORT_NAME,
  authors: [{ url: '', name: AUTHOR }],
  generator: 'generator',
  keywords: KEYWORDS,
  referrer: 'strict-origin-when-cross-origin', // https://itjava.tistory.com/25
  creator: AUTHOR,
  publisher: AUTHOR,
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: CANONICAL_URL },
  icons: {
    icon: [
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: {
      url: '/apple-icon.png',
      sizes: '180x180',
    },
    shortcut: '/favicon-32x32.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: APPLICATION_NAME,
    description: DESCRIPTION,
    emails: 'emails',
    phoneNumbers: 'phoneNumbers',
    faxNumbers: 'faxNumbers',
    siteName: APPLICATION_NAME,
    locale: defaultLocale,
    alternateLocale: locales.slice(1),
    images: {
      url: '/assets/og-image.webp',
      alt: APPLICATION_SHORT_NAME,
    },
    url: CANONICAL_URL,
    countryName: 'KR',
    type: 'website',
  },
  twitter: {
    site: APPLICATION_NAME,
    siteId: CANONICAL_URL,
    creator: 'creator',
    creatorId: 'creatorId',
    description: DESCRIPTION,
    title: APPLICATION_NAME,
    images: {
      url: '/assets/og-image.webp',
      alt: APPLICATION_SHORT_NAME,
    },
    card: 'summary_large_image',
  },
  verification: {
    google: 'google', // https://search.google.com/search-console/welcome
    yahoo: 'yahoo',
    yandex: 'yandex',
    me: 'me',
    other: {
      'google-adsense-account': 'google-adsense-account',
    },
  },
  appleWebApp: {
    capable: true,
    title: APPLICATION_SHORT_NAME,
    startupImage: [
      {
        url: '/assets/og-image.webp',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/assets/og-image.webp',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
    statusBarStyle: 'black',
  },
  formatDetection: {
    // FIXME: telephone=no, date=no, address=no, email=no, url=no 로 출력됨
    // telephone: true,
    // date: true,
    address: true,
    // email: true,
    // url: true,
  },
  itunes: {
    appId: 'appId',
    appArgument: 'appArgument',
  },
  abstract: DESCRIPTION,
  appLinks: {
    ios: {
      url: 'url',
      app_store_id: 'app_store_id',
      app_name: 'app_name',
    },
    iphone: {
      url: 'url',
      app_store_id: 'app_store_id',
      app_name: 'app_name',
    },
    ipad: {
      url: 'url',
      app_store_id: 'app_store_id',
      app_name: 'app_name',
    },
    android: {
      package: 'package',
      url: 'url',
      class: 'class',
      app_name: 'app_name',
    },
    windows_phone: {
      url: 'url',
      app_id: 'app_id',
      app_name: 'app_name',
    },
    windows: {
      url: 'url',
      app_id: 'app_id',
      app_name: 'app_name',
    },
    windows_universal: {
      url: 'url',
      app_id: 'app_id',
      app_name: 'app_name',
    },
    web: {
      url: 'url',
      should_fallback: true,
    },
  },
  archives: `${CANONICAL_URL}/archives`,
  assets: `${CANONICAL_URL}/assets`,
  bookmarks: `${CANONICAL_URL}/bookmarks`,
  category: CATEGORY,
  classification: CATEGORY,
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  // interactiveWidget: 'resizes-visual', // https://developer.chrome.com/blog/viewport-resize-behavior?hl=ko#opting_in_to_a_different_behavior
  viewportFit: 'cover',
  themeColor: THEME_COLOR,
  colorScheme: 'light',
}

const myFont = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap',
  weight: '400 700',
})

export async function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }]
}

export default function RootLayout({ children, params }: LayoutProps) {
  return (
    <html className="h-full" lang={params.locale}>
      <link color={THEME_COLOR} href="/safari-pinned-tab.svg" rel="mask-icon" />
      <meta content={THEME_COLOR} name="msapplication-TileColor" />

      <meta content="yes" name="mobile-web-app-capable" />
      <meta content={DESCRIPTION} name="subject" />
      <meta content="general" name="rating" />

      <body className={`h-full transition duration-300 ${myFont.className}`}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Authentication />
        <Toaster toastOptions={{ error: { duration: 6000 } }} />
        <div id="modal-root" />
      </body>
    </html>
  )
}
