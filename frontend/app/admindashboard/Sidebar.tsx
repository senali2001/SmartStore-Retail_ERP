'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Package, Truck, Tag,
  ShoppingCart, FileText, UserCircle, BarChart3,
  Settings, LogOut, Store, ChevronLeft, ChevronRight,
  Bell, ShoppingBag, Menu
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',       href: '/admindashboard',            badge: null },
  { icon: Users,           label: 'Staff Members',   href: '/admindashboard/staff',      badge: '4'  },
  { icon: Package,         label: 'Stock Management',href: '/admindashboard/stock',      badge: '3'  },
  { icon: Truck,           label: 'Suppliers',       href: '/admindashboard/suppliers',  badge: null },
  { icon: Tag,             label: 'Promotions',      href: '/admindashboard/promotions', badge: '2'  },
  { icon: ShoppingCart,    label: 'Orders',          href: '/admindashboard/orders',     badge: '8'  },
  { icon: FileText,        label: 'Invoices',        href: '/admindashboard/invoices',   badge: null },
  { icon: UserCircle,      label: 'Customers',       href: '/admindashboard/customers',  badge: null },
  { icon: BarChart3,       label: 'Reports',         href: '/admindashboard/reports',    badge: null },
  { icon: Settings,        label: 'Settings',        href: '/admindashboard/settings',   badge: null },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const pathname = usePathname()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const w = collapsed ? 72 : 260

  return (
    <>
      <aside
        className="admin-sidebar"
        style={{ width: w }}
      >
        <div className="sidebar-logo-section" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div className="sidebar-logo-icon">
            <Store size={18} color="#fff" />
          </div>
          {!collapsed && (
            <div className="sidebar-logo-text">
              <div className="sidebar-name">SmartStore</div>
              <div className="sidebar-sub">ERP Admin</div>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          style={{
            position: 'absolute',
            top: 16,
            right: -13,
            width: 26,
            height: 26,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: 'var(--shadow-md)',
            color: 'var(--text-muted)',
            transition: 'var(--t-fast)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
          }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        <nav className="sidebar-nav no-scroll">
          {!collapsed && (
            <div className="sidebar-section-label">NAVIGATION</div>
          )}

          {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => {
            const isActive = pathname === href || (href !== '/admindashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-item${isActive ? ' active' : ''}`}
                style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '11px 0' : '9px 20px' }}
                data-tip={collapsed ? label : undefined}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: isActive ? 600 : 500 }}>{label}</span>
                    {badge && (
                      <span className="sidebar-item-badge"
                        style={{ background: isActive ? 'var(--accent)' : 'var(--bg-hover)', color: isActive ? '#fff' : 'var(--text-muted)' }}
                      >{badge}</span>
                    )}
                  </>
                )}
              </Link>
            )
          })}

          <div style={{ margin: '8px 0', borderTop: '1px solid var(--border)' }} />

          <button
            className="sidebar-item"
            onClick={() => setLogoutOpen(true)}
            style={{
              color: 'var(--color-red)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '11px 0' : '9px 20px',
            }}
            data-tip={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 13.5, fontWeight: 500 }}>Logout</span>}
          </button>
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
            <div
              className="sidebar-avatar"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
            >
              A
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Admin User
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
            </div>
            <Settings size={14} color="var(--text-muted)" style={{ cursor: 'pointer', flexShrink: 0 }} />
          </div>
        )}
        {collapsed && (
          <div className="sidebar-footer" style={{ justifyContent: 'center', padding: '12px 0' }}>
            <div
              className="sidebar-avatar"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
            >
              A
            </div>
          </div>
        )}
      </aside>

      {logoutOpen && (
        <div className="modal-overlay" onClick={() => setLogoutOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44,
                borderRadius: 12,
                background: 'var(--color-red-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <LogOut size={20} color="var(--color-red)" />
              </div>
              <div>
                <div className="modal-title">Confirm Logout</div>
                <div className="modal-subtitle">Are you sure you want to logout?</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              You'll be signed out of your SmartStore admin session. Any unsaved changes will be lost.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setLogoutOpen(false)}>
                Cancel
              </button>
              <Link href="/" className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
                <LogOut size={14} /> Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
