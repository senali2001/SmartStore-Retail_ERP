'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Search, Bell, Sun, Moon, ChevronDown,
  User, Settings, LogOut, Menu, MessageSquare, X
} from 'lucide-react'
import Link from 'next/link'

const notifications = [
  { id: 1, type: 'alert',   title: 'Low stock alert',     desc: 'Apple Watch S9 has only 3 units left',      time: '2m ago',  read: false },
  { id: 2, type: 'order',   title: 'New order received',  desc: 'Order #SS-1042 from walk-in customer',      time: '8m ago',  read: false },
  { id: 3, type: 'expiry',  title: 'Expiring soon',       desc: '5 products expire within 7 days',           time: '1h ago',  read: true  },
  { id: 4, type: 'staff',   title: 'Staff login',         desc: 'Cashier Priya logged in',                   time: '2h ago',  read: true  },
]

interface Props {
  sidebarCollapsed: boolean
  onMenuClick: () => void
}

export default function AdminHeader({ sidebarCollapsed, onMenuClick }: Props) {
  const [time, setTime]             = useState('')
  const [date, setDate]             = useState('')
  const [dark, setDark]             = useState(false)
  const [notifOpen, setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef   = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      setDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }))
    }
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('smartstore-theme')
    if (saved === 'dark') { setDark(true); document.documentElement.setAttribute('data-theme', 'dark') }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
    localStorage.setItem('smartstore-theme', next ? 'dark' : 'light')
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unread = notifications.filter(n => !n.read).length

  const sidebarW = sidebarCollapsed ? 72 : 260

  return (
    <header
      className="admin-header"
      style={{ marginLeft: sidebarW, transition: 'margin-left 0.25s ease', position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-ghost btn-icon" onClick={onMenuClick} style={{ color: 'var(--text-secondary)' }}>
          <Menu size={18} />
        </button>

        <div className="search-wrap" style={{ width: 260 }}>
          <Search className="search-icon" size={14} />
          <input
            className="admin-input"
            placeholder="Search products, staff, orders…"
            style={{ paddingLeft: 34, height: 36, fontSize: 13 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        <div style={{
          background: 'var(--bg-hover)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)',
          padding: '5px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          lineHeight: 1.2,
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{date}</span>
        </div>

        <button
          className="btn btn-secondary btn-icon"
          onClick={toggleTheme}
          data-tip={dark ? 'Light mode' : 'Dark mode'}
          style={{ color: 'var(--text-secondary)' }}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <div className="dropdown" ref={notifRef}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => setNotifOpen(o => !o)}
            style={{ position: 'relative', color: 'var(--text-secondary)' }}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: 7, height: 7,
                background: 'var(--color-red)',
                borderRadius: '50%',
                border: '1.5px solid var(--bg-card)',
              }} />
            )}
          </button>

          {notifOpen && (
            <div className="dropdown-menu" style={{ minWidth: 320, right: 0 }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
                {unread > 0 && <span className="badge badge-red">{unread} new</span>}
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: '11px 14px',
                  display: 'flex',
                  gap: 10,
                  borderBottom: '1px solid var(--border)',
                  background: n.read ? 'transparent' : 'var(--accent-glow)',
                  cursor: 'pointer',
                  transition: 'var(--t-fast)',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'var(--accent-glow)')}
                >
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: n.read ? 'var(--border)' : 'var(--accent)',
                    flexShrink: 0,
                    marginTop: 5,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.desc}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 14px', textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>View all notifications</span>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown" ref={profileRef}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-hover)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: '5px 10px 5px 6px',
              cursor: 'pointer',
              transition: 'var(--t-fast)',
              font: 'inherit',
            }}
            onClick={() => setProfileOpen(o => !o)}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-light)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}>A</div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>Admin User</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Super Admin</div>
            </div>
            <ChevronDown size={13} color="var(--text-muted)" style={{ marginLeft: 2 }} />
          </button>

          {profileOpen && (
            <div className="dropdown-menu">
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Admin User</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>admin@smartstore.lk</div>
              </div>
              <Link href="/admindashboard/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                <User size={14} /> View Profile
              </Link>
              <Link href="/admindashboard/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                <Settings size={14} /> Settings
              </Link>
              <div className="dropdown-divider" />
              <Link href="/" className="dropdown-item danger">
                <LogOut size={14} /> Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
