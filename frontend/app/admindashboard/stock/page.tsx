'use client'
import { useState, useEffect } from 'react'
import {
  Package, Plus, Search, Download, Upload, Eye, Pencil, Trash2,
  AlertTriangle, Clock, TrendingDown, ChevronLeft, ChevronRight,
  RefreshCw, DollarSign, X
} from 'lucide-react'

const API_BASE = 'http://localhost:8080/api'
const PAGE_SIZE = 8

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  IN_STOCK:  { label: 'In Stock',      cls: 'badge-green'  },
  LOW_STOCK: { label: 'Low Stock',     cls: 'badge-orange' },
  CRITICAL:  { label: 'Critical',      cls: 'badge-red'    },
  EXPIRING:  { label: 'Expiring Soon', cls: 'badge-orange' },
  OUT_STOCK: { label: 'Out of Stock',  cls: 'badge-red'    },
  EXPIRED:   { label: 'Expired',       cls: 'badge-red'    },
}

export default function StockPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]     = useState('')
  const [cat, setCat]           = useState('ALL')
  const [status, setStatus]     = useState('ALL')
  const [page, setPage]         = useState(1)
  const [selected, setSelected] = useState<any | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const getProductStatus = (p: any) => {
    const qty = p.stockQuantity || 0
    const min = p.minimumStockLevel || 0
    const now = new Date()

    if (p.expiryDate) {
      const exp = new Date(p.expiryDate)
      if (exp < now) return 'EXPIRED'
      const diff = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24)
      if (diff <= 7) return 'EXPIRING'
    }

    if (qty <= 0) return 'OUT_STOCK'
    if (min > 0 && qty <= min * 0.3) return 'CRITICAL'
    if (min > 0 && qty <= min) return 'LOW_STOCK'
    return 'IN_STOCK'
  }

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchQ = !q || p.productName.toLowerCase().includes(q) || p.barcode?.includes(q) || p.brand?.toLowerCase().includes(q)
    const matchC = cat === 'ALL' || p.category === cat
    const resolvedStatus = getProductStatus(p)
    const matchS = status === 'ALL' || resolvedStatus === status
    return matchQ && matchC && matchS
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const totalValue   = products.reduce((s, p) => s + (p.buyingPrice || 0) * (p.stockQuantity || 0), 0)
  const lowStockCount = products.filter(p => {
    const s = getProductStatus(p)
    return s === 'LOW_STOCK' || s === 'CRITICAL' || s === 'OUT_STOCK'
  }).length
  const expiringSoon = products.filter(p => getProductStatus(p) === 'EXPIRING').length
  const expiredCount  = products.filter(p => getProductStatus(p) === 'EXPIRED').length

  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]
  const statuses = ['ALL', 'IN_STOCK', 'LOW_STOCK', 'CRITICAL', 'EXPIRING', 'OUT_STOCK', 'EXPIRED']

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stock Management</h1>
          <p className="page-subtitle">Track live inventory, buying prices, expiry dates, and alert levels</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fetchProducts}><RefreshCw size={14} /> Refresh</button>
          <button className="btn btn-secondary"><Upload size={14} /> Import</button>
          <button className="btn btn-secondary"><Download size={14} /> Export</button>
          <button className="btn btn-primary"><Plus size={14} /> Add Product</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Products',  value: products.length, icon: <Package size={16} />,    color: '#059669' },
          { label: 'Inventory Value', value: `Rs.${totalValue.toLocaleString()}`, raw: true, icon: <DollarSign size={16} />, color: '#2563eb' },
          { label: 'Low / Out Stock', value: lowStockCount,     icon: <TrendingDown size={16} />, color: '#d97706' },
          { label: 'Expiring Soon',   value: expiringSoon, icon: <Clock size={16} />,        color: '#db2777' },
          { label: 'Expired Products',value: expiredCount,      icon: <AlertTriangle size={16} />,color: '#dc2626' },
        ].map(s => (
          <div key={s.label} className="admin-card stat-card" style={{ padding: '16px 18px', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.8 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-wrap" style={{ width: 260 }}>
          <Search className="search-icon" size={14} />
          <input className="admin-input" placeholder="Search product, barcode…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ paddingLeft: 34, height: 36 }} />
        </div>
        <select className="admin-select" value={cat} onChange={e => { setCat(e.target.value); setPage(1) }} style={{ height: 36 }}>
          {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
        </select>
        <select className="admin-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} style={{ height: 36 }}>
          {statuses.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Status' : STATUS_CONFIG[s]?.label || s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>{filtered.length} products</span>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 10 }}>Loading products...</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>{['Barcode','Product','Category','Brand','Supplier','Buying Price','Selling Price','Margin','Qty','Min Qty','Expiry','Status','Actions'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {paged.map(p => {
                  const resolvedStatus = getProductStatus(p)
                  const sell = p.sellingPrice || 0
                  const buy = p.buyingPrice || 0
                  const margin = sell > 0 ? Math.round(((sell - buy) / sell) * 100) : 0
                  return (
                    <tr key={p.id}>
                      <td style={{ fontSize: 11.5, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p.barcode || '—'}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.productName}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Batch: {p.batchNumber || '—'}</div>
                      </td>
                      <td><span className="badge badge-gray">{p.category}</span></td>
                      <td style={{ fontSize: 12.5 }}>{p.brand || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.supplierName || '—'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Rs.{buy.toLocaleString()}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-green)' }}>Rs.{sell.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="progress-bar" style={{ width: 48 }}>
                            <div className="progress-fill" style={{ width: `${margin}%`, background: margin > 25 ? 'var(--color-green)' : 'var(--color-orange)' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700 }}>{margin}%</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: (p.stockQuantity || 0) <= (p.minimumStockLevel || 0) ? 'var(--color-red)' : 'var(--text-primary)' }}>{p.stockQuantity}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.minimumStockLevel || 0}</td>
                      <td style={{ fontSize: 12, color: resolvedStatus === 'EXPIRING' || resolvedStatus === 'EXPIRED' ? 'var(--color-red)' : 'var(--text-muted)' }}>{p.expiryDate || '—'}</td>
                      <td><span className={`badge ${STATUS_CONFIG[resolvedStatus]?.cls}`}>{STATUS_CONFIG[resolvedStatus]?.label}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-blue)' }} onClick={() => { setSelected(p); setViewOpen(true) }}><Eye size={13} /></button>
                          <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-green)' }}><Pencil size={13} /></button>
                          <button className="btn btn-ghost btn-xs" style={{ color: 'var(--color-red)' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="pagination" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={13} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={13} /></button>
          </div>
        )}
      </div>

      {viewOpen && selected && (
        <div className="modal-overlay" onClick={() => setViewOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div className="modal-title">{selected.productName}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setViewOpen(false)}><X size={16} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['Barcode', selected.barcode || '—'],
                ['Category', selected.category],
                ['Brand', selected.brand || '—'],
                ['Supplier', selected.supplierName || '—'],
                ['Buying Price', `Rs.${(selected.buyingPrice || 0).toLocaleString()}`],
                ['Selling Price', `Rs.${(selected.sellingPrice || 0).toLocaleString()}`],
                ['Qty', `${selected.stockQuantity || 0} units`],
                ['Min Qty', `${selected.minimumStockLevel || 0} units`],
                ['Batch No', selected.batchNumber || '—'],
                ['Mfg Date', selected.manufacturingDate || '—'],
                ['Exp Date', selected.expiryDate || '—'],
                ['Status', STATUS_CONFIG[getProductStatus(selected)]?.label],
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-hover)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
