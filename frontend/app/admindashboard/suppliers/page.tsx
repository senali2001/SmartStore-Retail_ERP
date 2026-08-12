'use client'
import { useState, useEffect } from 'react'
import {
  Truck, Plus, Search, Download, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, X, MapPin, Phone, Mail,
  Building2, PackageCheck, Calendar, DollarSign, RefreshCw
} from 'lucide-react'

const API_BASE = 'http://localhost:8080/api'
const PAGE_SIZE = 5

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)
  const [view, setView]     = useState<any | null>(null)

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_BASE}/suppliers`)
      if (res.ok) {
        const data = await res.json()
        setSuppliers(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase()
    return !q || s.companyName.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q) || s.supplierCode?.toLowerCase().includes(q)
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeCount    = suppliers.filter(s => s.status === 'ACTIVE').length
  const totalValue     = suppliers.reduce((a, s) => a + (s.totalPurchaseValue || 0), 0)
  const delivThisMonth = suppliers.filter(s => s.lastDeliveryDate && s.lastDeliveryDate >= '2026-07-01').length

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Suppliers</h1>
          <p className="page-subtitle">Manage your supply chain and vendor relationships</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fetchSuppliers}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-secondary"><Download size={14} /> Export</button>
          <button className="btn btn-primary"><Plus size={14} /> Add Supplier</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Suppliers',     value: suppliers.length, icon: <Truck size={16} />,       color: '#059669' },
          { label: 'Active Suppliers',    value: activeCount,      icon: <Building2 size={16} />,   color: '#2563eb' },
          { label: 'Total Purchase Value',value: `Rs.${(totalValue/1000).toFixed(0)}k`, raw: true, icon: <DollarSign size={16} />, color: '#7c3aed' },
          { label: 'Deliveries This Month', value: delivThisMonth, icon: <PackageCheck size={16} />,color: '#d97706' },
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

      <div className="toolbar">
        <div className="search-wrap" style={{ width: 280 }}>
          <Search className="search-icon" size={14} />
          <input className="admin-input" placeholder="Search supplier, contact…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ paddingLeft: 34, height: 36 }} />
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>{filtered.length} suppliers</span>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 10 }}>Loading suppliers...</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>{['Supplier ID','Company','Contact Person','Phone','Email','Payment Terms','Last Delivery','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paged.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{s.supplierCode || `SUP-${s.id}`}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.companyName}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                      <MapPin size={10} /> {s.address?.split(',')[1]?.trim() || s.address}
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{s.contactPerson}</td>
                  <td style={{ fontSize: 12.5 }}>{s.phone}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--color-blue)' }}>{s.email}</td>
                  <td style={{ fontSize: 12.5 }}>{s.paymentTerms || 'Cash'}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    {s.lastDeliveryDate ? new Date(s.lastDeliveryDate).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td><span className={`badge ${s.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}><span className="badge-dot" style={{ background: s.status === 'ACTIVE' ? 'var(--color-green)' : 'var(--color-red)' }} />{s.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-blue)' }} onClick={() => setView(s)}><Eye size={13} /></button>
                      <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-green)' }}><Pencil size={13} /></button>
                      <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-red)' }}><Trash2 size={13} /></button>
                    </div>
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

      {view && (
        <div className="modal-overlay" onClick={() => setView(null)}>
          <div className="modal-box" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div className="modal-title">{view.companyName}</div>
                <div className="modal-subtitle">{view.supplierCode}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setView(null)}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                [<Phone size={13} />,    'Contact',   view.contactPerson],
                [<Phone size={13} />,    'Phone',     view.phone],
                [<Mail size={13} />,     'Email',     view.email],
                [<MapPin size={13} />,   'Address',   view.address],
                [<PackageCheck size={13}/>,'Payment Terms', view.paymentTerms],
                [<Calendar size={13} />, 'Last Delivery', view.lastDeliveryDate ? new Date(view.lastDeliveryDate).toLocaleDateString('en-GB') : '—'],
                [<DollarSign size={13}/>,'Total Value', `Rs.${(view.totalPurchaseValue || 0).toLocaleString()}`],
                [null, 'Status', <span className={`badge ${view.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>{view.status}</span>],
              ].map(([icon, label, value], i) => (
                <div key={i} style={{ background: 'var(--bg-hover)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', marginTop: 1, flexShrink: 0 }}>{icon as React.ReactNode}</span>
                  <div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label as string}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 }}>{value as React.ReactNode}</div>
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
