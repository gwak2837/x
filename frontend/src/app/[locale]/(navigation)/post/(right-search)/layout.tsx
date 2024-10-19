import type { BaseLayoutProps } from '@/types/nextjs'

export default function Layout({ children }: BaseLayoutProps) {
  return (
    <main className="grid h-full lg:grid-cols-[1fr_300px] lg:gap-8 xl:gap-10">
      <div className="md:border-r">{children}</div>
      <div className="hidden text-center lg:block dark:bg-gray-800">검색</div>
    </main>
  )
}
