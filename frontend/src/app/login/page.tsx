import type { PageProps } from '@/types/nextjs'

import { NEXT_PUBLIC_BBATON_CLIENT_ID, NEXT_PUBLIC_BBATON_REDIRECT_URI } from '@/common/constants'
import Image from 'next/image'

import Login from './Login'
import Test from './Test'

export default async function Page({ params, searchParams }: PageProps) {
  return (
    <main className="min-h-[100dvh] p-4 sm:p-8 md:p-16 lg:p-24">
      <a
        href={`https://bauth.bbaton.com/oauth/authorize?client_id=${NEXT_PUBLIC_BBATON_CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_BBATON_REDIRECT_URI}&response_type=code&scope=read_profile`}
      >
        <Image
          alt="BBaton_Logo_Login_KR_v2.png"
          height="100"
          priority
          src="/images/BBaton_Logo_Login_KR_v2.png"
          width="350"
        />
      </a>
      <Login />
      <Test />
      <pre className="overflow-x-scroll">{JSON.stringify({ params, searchParams }, null, 2)}</pre>
    </main>
  )
}
