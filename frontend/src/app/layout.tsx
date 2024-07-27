import './globals.css'

import { LayoutProps } from '@/types/nextjs'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

import Authentication from './Authentication'
import ReactQueryProvider from '@/components/ReactQueryProvider'
import Navigation from './Navigation'

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
