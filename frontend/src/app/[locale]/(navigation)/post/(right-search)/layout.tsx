import type { BaseLayoutProps } from '@/types/nextjs'

export default function Layout({ children }: BaseLayoutProps) {
  return (
    <main className="grid min-h-full gap-10 lg:grid-cols-[1fr_300px]">
      <div className="md:border-r">{children}</div>
      <div className="hidden lg:block dark:bg-gray-800">검색</div>
    </main>
  )
}
