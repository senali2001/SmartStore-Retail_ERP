'use client'
import { useState } from 'react'
import {
  LayoutDashboard, ShoppingCart, Package, Users, Store,
  BarChart3, Truck, Warehouse, Tag, Receipt, Settings,
  CreditCard, Bell, ChevronRight, Layers, BookOpen,
  Globe, Percent, FileText, HelpCircle, LogOut, Zap
} from 'lucide-react'

const navSections = [
  {
    label: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', active: true, badge: null },
      { icon: BarChart3, label: 'Analytics', active: false, badge: null },
      { icon: Bell, label: 'Notifications', active: false, badge: '12' },
    ]
  },
  {
    label: 'COMMERCE',
    items: [
      { icon: ShoppingCart, label: 'Orders', active: false, badge: '8' },
      { icon: Tag, label: 'Products', active: false, badge: null },
      { icon: Percent, label: 'Promotions', active: false, badge: null },
      { icon: Receipt, label: 'Invoices', active: false, badge: null },
      { icon: CreditCard, label: 'Payments', active: false, badge: null },
    ]
  },
  {
    label: 'INVENTORY',
    items: [
      { icon: Package, label: 'Stock', active: false, badge: '3' },
      { icon: Warehouse, label: 'Warehouses', active: false, badge: null },
      { icon: Truck, label: 'Suppliers', active: false, badge: null },
      { icon: Layers, label: 'Categories', active: false, badge: null },
    ]
  },
  {
    label: 'CUSTOMERS',
    items: [
      { icon: Users, label: 'All Customers', active: false, badge: null },
      { icon: Globe, label: 'Segments', active: false, badge: null },
      { icon: BookOpen, label: 'Loyalty', active: false, badge: null },
    ]
  },
  {
    label: 'STORES',
    items: [
      { icon: Store, label: 'Locations', active: false, badge: null },
      { icon: Zap, label: 'POS Terminals', active: false, badge: null },
      { icon: FileText, label: 'Reports', active: false, badge: null },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { icon: Settings, label: 'Settings', active: false, badge: null },
      { icon: HelpCircle, label: 'Help & Docs', active: false, badge: null },
      { icon: LogOut, label: 'Logout', active: false, badge: null },
    ]
  }
]

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard')

  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34,
            background: 'var(--accent)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--accent-glow)',
          }}>
            <Store size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>RetailOS</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ERP Admin</div>
          </div>
        </div>
      </div>

      <nav
        className="sidebar-scroll"
        style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}
      >
        {navSections.map((section) => (
          <div key={section.label} style={{ marginBottom: 4 }}>
            <div style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              padding: '10px 20px 6px',
              textTransform: 'uppercase',
            }}>
              {section.label}
            </div>
            {section.items.map(({ icon: Icon, label, badge }) => {
              const isActive = activeItem === label
              return (
                <button
                  key={label}
                  onClick={() => setActiveItem(label)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 20px',
                    background: isActive ? 'var(--accent-glow)' : 'transparent',
                    border: 'none',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <Icon size={15} />
                  <span style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400, flex: 1 }}>{label}</span>
                  {badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: isActive ? 'var(--accent)' : 'var(--bg-hover)',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      borderRadius: 99,
                      padding: '1px 7px',
                      minWidth: 20, textAlign: 'center',
                    }}>{badge}</span>
                  )}
                  {isActive && <ChevronRight size={12} style={{ opacity: 0.6 }} />}
                </button>
              )
            })}
          </div>
        ))}
        <div style={{ height: 24 }} />
      </nav>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Super Admin</div>
        </div>
        <Settings size={14} color="var(--text-muted)" style={{ flexShrink: 0, cursor: 'pointer' }} />
      </div>
    </aside>
  )
}
