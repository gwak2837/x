import type { Metadata } from 'next'

import './globals.css'
import { Toaster } from 'react-hot-toast'
import Authentication from './Authentication'
import { LayoutProps } from '@/types/nextjs'

export const metadata: Metadata = {
  title: 'Bike',
  description: 'Bike',
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <Authentication />
        <Toaster toastOptions={{ error: { duration: 6000 } }} />
      </body>
    </html>
  )
}
