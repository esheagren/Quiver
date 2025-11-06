import type { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen h-screen bg-[rgb(250,248,245)]">
      <Header />
      <main className="container mx-auto px-6 py-6 max-w-7xl">
        {children}
      </main>
    </div>
  )
}

