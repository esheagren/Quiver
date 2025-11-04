import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-red-50/30">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        {children}
      </main>
    </div>
  )
}

