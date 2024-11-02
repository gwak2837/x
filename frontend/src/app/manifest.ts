/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  APPLICATION_NAME,
  APPLICATION_SHORT_NAME,
  CANONICAL_URL,
  DESCRIPTION,
  THEME_COLOR,
} from '@/common/constants'
import { type MetadataRoute } from 'next'

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: CANONICAL_URL,
    name: APPLICATION_NAME,
    description: DESCRIPTION,
    display: 'fullscreen',
    background_color: THEME_COLOR,
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: 'assets/screenshot/1.webp',
        sizes: '3680x2262',
        type: 'image/webp',
        form_factor: 'wide',
      },
      {
        src: 'assets/screenshot/2.webp',
        sizes: '3680x2262',
        type: 'image/webp',
        form_factor: 'wide',
      },
      {
        src: 'assets/screenshot/3.webp',
        sizes: '3680x2262',
        type: 'image/webp',
        form_factor: 'wide',
      },
      {
        src: 'assets/screenshot/4.webp',
        sizes: '3680x2262',
        type: 'image/webp',
        form_factor: 'wide',
      },
    ],
    short_name: APPLICATION_SHORT_NAME,
    start_url: '/',
    theme_color: THEME_COLOR,
  }
}
