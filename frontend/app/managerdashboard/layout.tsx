'use client'

import { useState } from 'react'
import Header from './Header'
import Slidebar from './Slidebar'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen md:flex">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Slidebar open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      <div className="min-w-0 w-full md:ml-60 md:w-[calc(100%-15rem)]">
        <Header onMenuClick={() => setMobileOpen(open => !open)} />
        <main className="manager-main min-w-0 p-4 sm:p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}