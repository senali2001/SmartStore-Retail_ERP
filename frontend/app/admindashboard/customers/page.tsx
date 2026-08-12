'use client'
import { useState, useEffect } from 'react'
import {
  UserCircle, Search, Eye, ChevronLeft, ChevronRight, X, Star,
  ShoppingBag, DollarSign, Phone, Mail, Award, Clock, RefreshCw, Calendar, MapPin
} from 'lucide-react'

const API_BASE = 'http://localhost:8080/api'
const PAGE_SIZE = 6

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const [view, setView]     = useState<any | null>(null)

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers`)
      const resTop = await fetch(`${API_BASE}/customers/top`)
      if (res.ok) {
        const data = await res.json()
        setCustomers(data)
      }
      if (resTop.ok) {
        const topData = await resTop.json()
        setTopCustomers(topData)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q)
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const total     = customers.length
  const newToday  = customers.filter(c => c.registrationDate && c.registrationDate.startsWith(new Date().toISOString().split('T')[0])).length
  const returning = customers.filter(c => c.totalOrders > 1).length
  const silver    = customers.filter(c => c.membershipLevel === 'SILVER').length
  const gold      = customers.filter(c => c.membershipLevel === 'GOLD').length

  const getTierColor = (tier: string) => {
    if (tier === 'GOLD') return '#d97706'
    if (tier === 'SILVER') return '#9ca3af'
    return '#6b7280'
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Real-time loyalty points, membership levels, and spending metrics</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchCustomers}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Customers',    value: total,     color: '#059669', icon: <UserCircle size={16} /> },
          { label: 'New Today',          value: newToday,   color: '#2563eb', icon: <Clock size={16} /> },
          { label: 'Returning Customers',value: returning, color: '#0d9488', icon: <ShoppingBag size={16} /> },
          { label: 'Silver Members',     value: silver,    color: '#6b7280', icon: <Star size={16} /> },
          { label: 'Gold Members',       value: gold,      color: '#d97706', icon: <Award size={16} /> },
        ].map(s => (
          <div key={s.label} className="admin-card stat-card" style={{ padding: '16px 18px', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        
        <div>
          <div className="toolbar">
            <div className="search-wrap" style={{ width: 280 }}>
              <Search className="search-icon" size={14} />
              <input className="admin-input" placeholder="Search customer, phone..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ paddingLeft: 34, height: 36 }} />
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>{filtered.length} customers</span>
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <div style={{ marginTop: 10 }}>Loading customers...</div>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>{['ID','Name','Phone','Membership','Loyalty Points','Orders','Total Spending','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {paged.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>#{String(c.id).padStart(4, '0')}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{c.name}</td>
                      <td style={{ fontSize: 12.5 }}>{c.phone}</td>
                      <td>
                        <span className="badge" style={{ background: `${getTierColor(c.membershipLevel)}22`, color: getTierColor(c.membershipLevel), fontWeight: 700 }}>
                          <Star size={10} fill="currentColor" /> {c.membershipLevel}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-purple)' }}>{(c.loyaltyPoints || 0).toLocaleString()} pts</td>
                      <td style={{ fontWeight: 600 }}>{c.totalOrders || 0}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-green)' }}>Rs.{(c.totalSpending || 0).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-blue)' }} onClick={() => setView(c)}><Eye size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {totalPages > 1 && (
              <div className="pagination" style={{ borderTop: '1px solid var(--border)' }}>
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => <button key={n} className={`page-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>)}
                <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="admin-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Top 10 Customers</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Ranked by total spending</div>
            {topCustomers.slice(0, 10).map((tc, idx) => (
              <div key={tc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: idx < 9 ? '1px solid var(--border)' : 'none' }}>
                <span style={{
                  width: 22, height: 22,
                  borderRadius: 6,
                  background: idx < 3 ? 'var(--accent-glow)' : 'var(--bg-hover)',
                  color: idx < 3 ? 'var(--accent)' : 'var(--text-muted)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700
                }}>{idx + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tc.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tc.phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-green)' }}>Rs.{(tc.totalSpending || 0).toLocaleString()}</div>
                  <span className="badge" style={{ fontSize: 9.5, padding: '1px 4px', background: `${getTierColor(tc.membershipLevel)}15`, color: getTierColor(tc.membershipLevel) }}>{tc.membershipLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {view && (
        <div className="modal-overlay" onClick={() => setView(null)}>
          <div className="modal-box" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div className="modal-title">{view.name}</div>
                <div className="modal-subtitle">Customer ID: #{String(view.id).padStart(4, '0')}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setView(null)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className="badge" style={{ background: `${getTierColor(view.membershipLevel)}22`, color: getTierColor(view.membershipLevel), fontWeight: 700 }}>
                <Star size={10} fill="currentColor" style={{ marginRight: 3 }} /> {view.membershipLevel} Member
              </span>
              <span className="badge badge-purple">{view.loyaltyPoints || 0} Points</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                [<Phone size={13} />, 'Phone Number', view.phone],
                [<Mail size={13} />, 'Email Address', view.email || '—'],
                [<MapPin size={13} />, 'Address', view.address || '—'],
                [<Calendar size={13} />, 'Registration Date', view.registrationDate ? new Date(view.registrationDate).toLocaleDateString('en-GB') : '—'],
                [<ShoppingBag size={13} />, 'Total Orders', `${view.totalOrders || 0} visits`],
                [<DollarSign size={13} />, 'Lifetime Spending', `Rs.${(view.totalSpending || 0).toLocaleString()}`],
                [<Award size={13} />, 'Average Order Value', `Rs.${view.totalOrders > 0 ? Math.round(view.totalSpending / view.totalOrders).toLocaleString() : 0}`],
                [<Clock size={13} />, 'Most Recent Purchase', view.lastPurchaseDate ? new Date(view.lastPurchaseDate).toLocaleDateString('en-GB') : '—'],
              ].map(([icon, label, val], i) => (
                <div key={i} style={{ background: 'var(--bg-hover)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', marginTop: 1, flexShrink: 0 }}>{icon as React.ReactNode}</span>
                  <div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label as string}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginTop: 3 }}>{val as React.ReactNode}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setView(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
