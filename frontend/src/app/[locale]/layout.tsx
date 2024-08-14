import type { LayoutProps } from '@/types/nextjs'
import type { Metadata } from 'next'

import ReactQueryProvider from '@/components/ReactQueryProvider'
import localFont from 'next/font/local'
import { Toaster } from 'react-hot-toast'

import Authentication from './Authentication'
import Navigation from './Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bike',
  description: 'Bike',
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
    <html lang={params.locale}>
      <body className={myFont.className}>
        <Navigation locale={params.locale} />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Authentication />
        <Toaster toastOptions={{ error: { duration: 6000 } }} />
      </body>
    </html>
  )
}
