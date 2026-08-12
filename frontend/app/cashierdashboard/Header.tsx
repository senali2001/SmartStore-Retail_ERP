'use client'
import { Search, Bell, RefreshCw } from 'lucide-react'

export default function Header() {
  return (
    <header style={{
      height: 60,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Dashboard
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Overview · March 24, 2026
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '7px 14px',
          width: 220,
        }}>
          <Search size={13} color="var(--text-muted)" />
          <input
            placeholder="Search orders, products..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 12.5,
              color: 'var(--text-primary)',
              width: '100%',
            }}
          />
        </div>

        <button style={{
          width: 34, height: 34,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
        }}>
          <RefreshCw size={13} />
        </button>

        <button style={{
          width: 34, height: 34,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          color: 'var(--text-secondary)',
        }}>
          <Bell size={13} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 6, height: 6,
            background: 'var(--accent-red)',
            borderRadius: '50%',
          }} />
        </button>

        <div style={{
          width: 34, height: 34,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
          cursor: 'pointer',
        }}>A</div>
      </div>
    </header>
  )
}
