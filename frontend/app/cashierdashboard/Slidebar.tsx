'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, History, UserCircle2, Settings, LogOut, Store, PlusCircle } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/cashierdashboard' },
  { icon: PlusCircle, label: 'New Bill', href: '/cashierdashboard/new-bill' },
  { icon: History, label: 'History', href: '/cashierdashboard/history' },
  { icon: UserCircle2, label: 'Profile', href: '/cashierdashboard/profile' },
  { icon: Settings, label: 'Settings', href: '/cashierdashboard/settings' },
  { icon: LogOut, label: 'Logout', href: '/components/login' },
]

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`fixed left-0 top-0 z-50 flex h-dvh w-60 max-w-[calc(100vw-3rem)] flex-col border-r border-emerald-900/40 bg-black transition-transform duration-200 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-3 border-b border-emerald-900/40 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-900/40">
          <Store size={18} color="#fff" />
        </div>
        <div>
          <div className="text-base font-semibold text-white">RetailOS</div>
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-400">Cashier Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href

          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={`mb-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-emerald-900/40 px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 font-semibold text-black">
            C
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Cashier User</div>
            <div className="text-xs text-emerald-400">Online</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
