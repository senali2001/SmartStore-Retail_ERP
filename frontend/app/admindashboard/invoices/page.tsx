'use client'
import { useState, useEffect } from 'react'
import { FileText, Search, Download, Printer, Eye, CheckCircle, Clock, ChevronLeft, ChevronRight, X, DollarSign, RefreshCw } from 'lucide-react'

const API_BASE = 'http://localhost:8080/api'
const PAGE_SIZE = 7

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [page, setPage]     = useState(1)
  const [view, setView]     = useState<any | null>(null)

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE}/bills`)
      if (res.ok) {
        const data = await res.json()
        setInvoices(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const todayRevenue  = invoices.filter(i => i.status === 'COMPLETED').reduce((s, i) => s + (i.totalAmount || 0), 0)
  const monthRevenue  = todayRevenue * 1.5
  const completedCount = invoices.filter(i => i.status === 'COMPLETED').length
  const pendingCount   = invoices.filter(i => i.status === 'PENDING' || i.status === 'PROCESSING').length

  const filtered = invoices.filter(i => {
    const q = search.toLowerCase()
    const matchQ = !q || i.billNumber.toLowerCase().includes(q) || i.customerName?.toLowerCase().includes(q) || i.cashierName?.toLowerCase().includes(q)
    const matchF = filter === 'ALL' || i.status === filter
    return matchQ && matchF
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDownloadPdf = (id: number) => {
    window.open(`${API_BASE}/bills/${id}/pdf`, '_blank')
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">View, print, and download live sales invoices from the checkout registers</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fetchInvoices}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-secondary"><Download size={14} /> Export</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: "Today's Invoices", value: invoices.length,                              icon: <FileText size={16} />,    color: '#059669' },
          { label: 'Estimated Month Revenue',  value: `Rs.${monthRevenue.toLocaleString()}`, raw: true, icon: <DollarSign size={16} />, color: '#2563eb' },
          { label: 'Completed',             value: completedCount,                                         icon: <CheckCircle size={16} />, color: '#059669' },
          { label: 'Pending',          value: pendingCount,                                       icon: <Clock size={16} />,       color: '#d97706' },
        ].map(s => (
          <div key={s.label} className="admin-card stat-card" style={{ padding: '16px 18px', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-wrap" style={{ width: 280 }}>
          <Search className="search-icon" size={14} />
          <input className="admin-input" placeholder="Search invoice number, customer…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ paddingLeft: 34, height: 36 }} />
        </div>
        {['ALL','COMPLETED','CANCELLED'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setFilter(f); setPage(1) }}>
            {f === 'ALL' ? 'All' : f === 'COMPLETED' ? 'Paid' : 'Cancelled'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>{filtered.length} invoices</span>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 10 }}>Loading invoices...</div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>{['Invoice #','Customer','Cashier','Date & Time','Amount','Payment','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paged.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12.5 }}>{inv.billNumber}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{inv.customerName || 'Walk-in Customer'}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{inv.cashierName}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inv.createdAt}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-green)', fontSize: 13 }}>Rs.{(inv.totalAmount || 0).toLocaleString()}</td>
                  <td><span className="badge badge-gray">{inv.paymentMethod || 'CASH'}</span></td>
                  <td>
                    <span className={`badge ${inv.status === 'COMPLETED' ? 'badge-green' : 'badge-red'}`}>
                      <span className="badge-dot" style={{ background: inv.status === 'COMPLETED' ? 'var(--color-green)' : 'var(--color-red)' }} />
                      {inv.status === 'COMPLETED' ? 'PAID' : 'CANCELLED'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-blue)' }} onClick={() => setView(inv)}><Eye size={13} /></button>
                      <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-purple)' }} onClick={() => handleDownloadPdf(inv.id)}><Printer size={13} /></button>
                      <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-green)' }} onClick={() => handleDownloadPdf(inv.id)}><Download size={13} /></button>
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
          <div className="modal-box" style={{ maxWidth: 450 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div className="modal-title">Invoice Details</div>
                <div className="modal-subtitle" style={{ fontFamily: 'monospace' }}>{view.billNumber}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setView(null)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                ['Customer', view.customerName || 'Walk-in Customer'],
                ['Cashier', view.cashierName],
                ['Date', view.createdAt],
                ['Subtotal', `Rs.${(view.subtotal || 0).toLocaleString()}`],
                ['Discount', `Rs.${(view.discountAmount || 0).toLocaleString()}`],
                ['Total Amount', `Rs.${(view.totalAmount || 0).toLocaleString()}`],
                ['Payment Method', view.paymentMethod || 'CASH'],
                ['Status', view.status]
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setView(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => handleDownloadPdf(view.id)}><Printer size={13} /> Print Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
