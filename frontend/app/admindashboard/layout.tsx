'use client'
import { useState, useSyncExternalStore } from 'react'
import './admin.css'
import Sidebar from './Sidebar'
import AdminHeader from './Header'

function subscribeToSidebar(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener('smartstore-sidebar-change', onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener('smartstore-sidebar-change', onChange)
  }
}

function getSidebarSnapshot() {
  return localStorage.getItem('smartstore-sidebar') === 'collapsed'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribeToSidebar, getSidebarSnapshot, () => false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleSidebar = () => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      setMobileOpen(open => !open)
      return
    }

    localStorage.setItem('smartstore-sidebar', collapsed ? 'expanded' : 'collapsed')
    window.dispatchEvent(new Event('smartstore-sidebar-change'))
  }

  const sidebarW = collapsed ? 72 : 260

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {mobileOpen && (
        <button
          type="button"
          className="admin-mobile-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <Sidebar
        collapsed={collapsed && !mobileOpen}
        onToggle={toggleSidebar}
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />

      <div
        className="admin-content"
        style={{
          marginLeft: sidebarW,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.25s ease',
        }}
      >
        <AdminHeader onMenuClick={toggleSidebar} />

        <main className="admin-main" style={{ flex: 1, padding: '24px', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}