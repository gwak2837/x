import type { Metadata } from 'next'

import ReactQueryProvider from '@/components/ReactQueryProvider'
import { LayoutProps } from '@/types/nextjs'
import { Toaster } from 'react-hot-toast'

import Authentication from './Authentication'
import Navigation from './Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bike',
  description: 'Bike',
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Authentication />
        <Toaster toastOptions={{ error: { duration: 6000 } }} />
      </body>
    </html>
  )
}
