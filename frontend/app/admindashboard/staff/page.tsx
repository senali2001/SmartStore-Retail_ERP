'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Users, UserPlus, Search, Filter, Download, Eye, Pencil,
  Trash2, KeyRound, X, Check, ChevronDown, ChevronLeft,
  ChevronRight, Mail, Phone, CreditCard, Calendar,
  DollarSign, Shield, RefreshCw, AlertTriangle, BadgeCheck,
  UserCheck, UserX, Clock, Building2, MoreHorizontal
} from 'lucide-react'

interface StaffMember {
  id?: number
  username: string
  fullName: string
  email: string
  phone: string
  nic: string
  role: string
  password?: string
  salary: number
  joinDate: string
  status: string
  createdAt?: string
}

const SAMPLE_STAFF: StaffMember[] = [
  { id: 1, username: 'admin',   fullName: 'Kamal Perera',    email: 'kamal@smartstore.lk',   phone: '0771234567', nic: '901234567V',  role: 'ADMIN',   salary: 85000, joinDate: '2021-03-15', status: 'ACTIVE'   },
  { id: 2, username: 'mgr01',   fullName: 'Nimal Silva',     email: 'nimal@smartstore.lk',   phone: '0772345678', nic: '851234567V',  role: 'MANAGER', salary: 65000, joinDate: '2021-07-01', status: 'ACTIVE'   },
  { id: 3, username: 'cash01',  fullName: 'Priya Kumari',    email: 'priya@smartstore.lk',   phone: '0773456789', nic: '970234567V',  role: 'CASHIER', salary: 38000, joinDate: '2022-01-10', status: 'ACTIVE'   },
  { id: 4, username: 'cash02',  fullName: 'Amara Fernando',  email: 'amara@smartstore.lk',   phone: '0774567890', nic: '980134567V',  role: 'CASHIER', salary: 38000, joinDate: '2022-06-15', status: 'ACTIVE'   },
  { id: 5, username: 'cash03',  fullName: 'Ruwan Bandara',   email: 'ruwan@smartstore.lk',   phone: '0775678901', nic: '990234567V',  role: 'CASHIER', salary: 38000, joinDate: '2023-02-20', status: 'INACTIVE' },
  { id: 6, username: 'mgr02',   fullName: 'Dilshan Jayawardena', email: 'dilshan@smartstore.lk', phone: '0776789012', nic: '870334567V', role: 'MANAGER', salary: 62000, joinDate: '2023-05-01', status: 'ACTIVE'   },
  { id: 7, username: 'cash04',  fullName: 'Sachini Rathnayake', email: 'sachini@smartstore.lk', phone: '0777890123', nic: '010234567V', role: 'CASHIER', salary: 40000, joinDate: '2024-01-08', status: 'ACTIVE'   },
  { id: 8, username: 'cash05',  fullName: 'Tharaka Wijesinghe', email: 'tharaka@smartstore.lk', phone: '0778901234', nic: '000134567V', role: 'CASHIER', salary: 40000, joinDate: '2024-03-12', status: 'ACTIVE'   },
]

const ROLES = ['ALL', 'ADMIN', 'MANAGER', 'CASHIER']
const STATUSES = ['ALL', 'ACTIVE', 'INACTIVE']
const ROLE_COLORS: Record<string, string> = {
  ADMIN:   'badge-purple',
  MANAGER: 'badge-blue',
  CASHIER: 'badge-teal',
}

const API_BASE = 'http://localhost:8080/api'

function avatarColor(name: string) {
  const colors = ['#059669','#2563eb','#7c3aed','#d97706','#db2777','#0d9488','#ea580c','#65a30d']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const emptyForm = (): StaffMember => ({
  username: '', fullName: '', email: '', phone: '', nic: '',
  role: 'CASHIER', password: '', salary: 0, joinDate: '', status: 'ACTIVE',
})

const PAGE_SIZE = 6

export default function StaffPage() {
  const [staff, setStaff]               = useState<StaffMember[]>(SAMPLE_STAFF)
  const [loading, setLoading]           = useState(false)
  const [search, setSearch]             = useState('')
  const [roleFilter, setRoleFilter]     = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [page, setPage]                 = useState(1)
  const [modalMode, setModalMode]       = useState<null | 'add' | 'edit' | 'view' | 'delete' | 'reset'>(null)
  const [selected, setSelected]         = useState<StaffMember | null>(null)
  const [form, setForm]                 = useState<StaffMember>(emptyForm())
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [resetPwd, setResetPwd]         = useState('')

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/users`)
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) setStaff(data)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStaff() }, [])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const filtered = staff.filter(s => {
    const q = search.toLowerCase()
    const matchQ = !q || s.fullName.toLowerCase().includes(q) || s.username.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.nic.toLowerCase().includes(q)
    const matchR = roleFilter === 'ALL' || s.role === roleFilter
    const matchS = statusFilter === 'ALL' || s.status === statusFilter
    return matchQ && matchR && matchS
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const total    = staff.length
  const active   = staff.filter(s => s.status === 'ACTIVE').length
  const cashiers = staff.filter(s => s.role === 'CASHIER').length
  const managers = staff.filter(s => s.role === 'MANAGER').length
  const admins   = staff.filter(s => s.role === 'ADMIN').length

  const openAdd  = () => { setForm(emptyForm()); setModalMode('add') }
  const openEdit = (s: StaffMember) => { setForm({ ...s }); setSelected(s); setModalMode('edit') }
  const openView = (s: StaffMember) => { setSelected(s); setModalMode('view') }
  const openDel  = (s: StaffMember) => { setSelected(s); setModalMode('delete') }
  const openReset= (s: StaffMember) => { setSelected(s); setResetPwd(''); setModalMode('reset') }
  const closeModal = () => { setModalMode(null); setSelected(null) }

  const handleSave = async () => {
    if (!form.fullName || !form.username || !form.email) {
      showToast('Please fill all required fields', 'error'); return
    }
    setSaving(true)
    try {
      if (modalMode === 'add') {
        const res = await fetch(`${API_BASE}/users`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, salary: Number(form.salary) })
        })
        if (res.ok) {
          const newUser = await res.json()
          setStaff(prev => [...prev, newUser])
          showToast(`${form.fullName} added successfully!`)
        } else {
          setStaff(prev => [...prev, { ...form, id: Date.now(), salary: Number(form.salary) }])
          showToast(`${form.fullName} added (offline mode)`)
        }
      } else if (modalMode === 'edit' && selected?.id) {
        const res = await fetch(`${API_BASE}/users/${selected.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, salary: Number(form.salary) })
        })
        setStaff(prev => prev.map(s => s.id === selected.id ? { ...s, ...form, salary: Number(form.salary) } : s))
        showToast(`${form.fullName} updated successfully!`)
      }
    } catch {
      setStaff(prev => {
        if (modalMode === 'add') return [...prev, { ...form, id: Date.now(), salary: Number(form.salary) }]
        return prev.map(s => s.id === selected?.id ? { ...s, ...form } : s)
      })
      showToast(modalMode === 'add' ? 'Staff added (offline)' : 'Staff updated (offline)')
    } finally {
      setSaving(false)
      closeModal()
    }
  }

  const handleDelete = async () => {
    if (!selected?.id) return
    setSaving(true)
    try {
      await fetch(`${API_BASE}/users/${selected.id}`, { method: 'DELETE' })
    } catch { /* ignore */ }
    setStaff(prev => prev.filter(s => s.id !== selected.id))
    showToast(`${selected.fullName} removed`)
    setSaving(false)
    closeModal()
  }

  const handleResetPwd = async () => {
    if (!resetPwd || resetPwd.length < 4) { showToast('Password must be at least 4 characters', 'error'); return }
    setSaving(true)
    try {
      await fetch(`${API_BASE}/users/${selected?.id}/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPwd })
      })
    } catch { /* ignore */ }
    showToast(`Password reset for ${selected?.fullName}`)
    setSaving(false)
    closeModal()
  }

  const setF = (k: keyof StaffMember, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="admin-page">

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'success' ? 'var(--color-green)' : 'var(--color-red)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 'var(--r-lg)',
          fontSize: 13.5,
          fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {toast.type === 'success' ? <Check size={15} /> : <X size={15} />}
          {toast.msg}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Manage your store team, roles, and permissions</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={fetchStaff}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-secondary">
            <Download size={14} /> Export
          </button>
          <button className="btn btn-primary" onClick={openAdd}>
            <UserPlus size={15} /> Add Staff
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Staff',   value: total,    icon: <Users size={16} />,     color: '#059669' },
          { label: 'Active',        value: active,   icon: <UserCheck size={16} />, color: '#2563eb' },
          { label: 'Cashiers',      value: cashiers, icon: <BadgeCheck size={16} />,color: '#0d9488' },
          { label: 'Managers',      value: managers, icon: <Building2 size={16} />, color: '#7c3aed' },
          { label: 'Administrators',value: admins,   icon: <Shield size={16} />,    color: '#d97706' },
        ].map(s => (
          <div key={s.label} className="admin-card stat-card" style={{ padding: '16px 18px', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.8 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-wrap" style={{ width: 280 }}>
          <Search className="search-icon" size={14} />
          <input
            className="admin-input"
            placeholder="Search by name, username, NIC…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{ paddingLeft: 34, height: 36 }}
          />
        </div>
        <select className="admin-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1) }} style={{ height: 36 }}>
          {ROLES.map(r => <option key={r} value={r}>{r === 'ALL' ? 'All Roles' : r}</option>)}
        </select>
        <select className="admin-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} style={{ height: 36 }}>
          {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Status' : s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--text-muted)' }}>
          {filtered.length} of {total} staff
        </span>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={22} style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ marginTop: 10, fontSize: 13 }}>Loading staff…</div>
          </div>
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Users size={24} /></div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>No staff found</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Try adjusting your search or filters</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {['Profile', 'Employee ID', 'Full Name', 'Email', 'Phone', 'NIC', 'Role', 'Salary', 'Join Date', 'Status', 'Actions'].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((s, i) => (
                  <tr key={s.id || i}>
                    <td>
                      <div className="avatar avatar-md" style={{ background: avatarColor(s.fullName) }}>
                        {initials(s.fullName)}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 11.5, fontFamily: 'monospace', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '2px 7px', borderRadius: 5 }}>
                        #{String(s.id || i + 1).padStart(4, '0')}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13.5 }}>{s.fullName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>@{s.username}</div>
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{s.email}</td>
                    <td style={{ fontSize: 12.5 }}>{s.phone}</td>
                    <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{s.nic}</td>
                    <td><span className={`badge ${ROLE_COLORS[s.role] || 'badge-gray'}`}>{s.role}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
                      Rs.{(s.salary || 0).toLocaleString()}
                    </td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                      {s.joinDate ? new Date(s.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
                        <span className="badge-dot" style={{ background: s.status === 'ACTIVE' ? 'var(--color-green)' : 'var(--color-red)' }} />
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button className="btn btn-ghost btn-xs" onClick={() => openView(s)} data-tip="View Profile" style={{ color: 'var(--color-blue)' }}>
                          <Eye size={13} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => openEdit(s)} data-tip="Edit" style={{ color: 'var(--color-green)' }}>
                          <Pencil size={13} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => openReset(s)} data-tip="Reset Password" style={{ color: 'var(--color-orange)' }}>
                          <KeyRound size={13} />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => openDel(s)} data-tip="Delete" style={{ color: 'var(--color-red)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={13} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════════════ */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                {modalMode === 'add' ? <UserPlus size={20} /> : <Pencil size={20} />}
              </div>
              <div>
                <div className="modal-title">{modalMode === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}</div>
                <div className="modal-subtitle">{modalMode === 'add' ? 'Fill in the details to create a new account' : `Editing ${selected?.fullName}`}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={closeModal} style={{ marginLeft: 'auto' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input className="admin-input" placeholder="e.g. Kamal Perera" value={form.fullName} onChange={e => setF('fullName', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Username *</label>
                  <input className="admin-input" placeholder="e.g. kamal01" value={form.username} onChange={e => setF('username', e.target.value)} />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label">Email Address *</label>
                  <input className="admin-input" type="email" placeholder="kamal@smartstore.lk" value={form.email} onChange={e => setF('email', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input className="admin-input" placeholder="07X XXXXXXX" value={form.phone} onChange={e => setF('phone', e.target.value)} />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label">NIC Number</label>
                  <input className="admin-input" placeholder="XXXXXXXXX V" value={form.nic} onChange={e => setF('nic', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Role *</label>
                  <select className="admin-select" value={form.role} onChange={e => setF('role', e.target.value)}>
                    <option value="CASHIER">Cashier</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label">Monthly Salary (Rs.)</label>
                  <input className="admin-input" type="number" placeholder="e.g. 40000" value={form.salary || ''} onChange={e => setF('salary', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Join Date</label>
                  <input className="admin-input" type="date" value={form.joinDate} onChange={e => setF('joinDate', e.target.value)} />
                </div>
              </div>

              <div className="form-grid-2">
                {modalMode === 'add' && (
                  <div className="input-group">
                    <label className="input-label">Password *</label>
                    <input className="admin-input" type="password" placeholder="Min. 6 characters" value={form.password || ''} onChange={e => setF('password', e.target.value)} />
                  </div>
                )}
                <div className="input-group">
                  <label className="input-label">Status</label>
                  <select className="admin-select" value={form.status} onChange={e => setF('status', e.target.value)}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                {saving ? 'Saving…' : (modalMode === 'add' ? 'Add Staff Member' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          VIEW PROFILE MODAL
      ══════════════════════════════════════════════════ */}
      {modalMode === 'view' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div className="avatar avatar-lg" style={{ background: avatarColor(selected.fullName), width: 72, height: 72, fontSize: 26, borderRadius: 20, margin: '0 auto 12px' }}>
                {initials(selected.fullName)}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{selected.fullName}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>@{selected.username}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
                <span className={`badge ${ROLE_COLORS[selected.role] || 'badge-gray'}`}>{selected.role}</span>
                <span className={`badge ${selected.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>
                  <span className="badge-dot" style={{ background: selected.status === 'ACTIVE' ? 'var(--color-green)' : 'var(--color-red)' }} />
                  {selected.status}
                </span>
              </div>
            </div>

            <hr className="section-divider" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { icon: <Mail size={14} />,     label: 'Email',     value: selected.email     },
                { icon: <Phone size={14} />,    label: 'Phone',     value: selected.phone     },
                { icon: <CreditCard size={14}/>,label: 'NIC',       value: selected.nic       },
                { icon: <DollarSign size={14}/>,label: 'Salary',    value: `Rs.${(selected.salary||0).toLocaleString()}` },
                { icon: <Calendar size={14} />, label: 'Join Date', value: selected.joinDate ? new Date(selected.joinDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : '—' },
                { icon: <Clock size={14} />,    label: 'Created',   value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-GB') : '—' },
              ].map(d => (
                <div key={d.label} style={{
                  background: 'var(--bg-hover)', borderRadius: 10, padding: '12px 14px',
                  display: 'flex', gap: 10, alignItems: 'flex-start,',
                }}>
                  <span style={{ color: 'var(--accent)', marginTop: 1, flexShrink: 0 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{d.value || '—'}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
              <button className="btn btn-primary" onClick={() => { closeModal(); openEdit(selected) }}>
                <Pencil size={13} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DELETE CONFIRMATION
      ══════════════════════════════════════════════════ */}
      {modalMode === 'delete' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={20} color="var(--color-red)" />
              </div>
              <div>
                <div className="modal-title">Delete Staff Member</div>
                <div className="modal-subtitle">This action cannot be undone</div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{selected.fullName}</strong>? 
              Their account and access will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete} disabled={saving}>
                {saving ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                {saving ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          RESET PASSWORD MODAL
      ══════════════════════════════════════════════════ */}
      {modalMode === 'reset' && selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-orange-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <KeyRound size={20} color="var(--color-orange)" />
              </div>
              <div>
                <div className="modal-title">Reset Password</div>
                <div className="modal-subtitle">For {selected.fullName}</div>
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: 20 }}>
              <label className="input-label">New Password</label>
              <input className="admin-input" type="password" placeholder="Enter new password (min. 4 chars)" value={resetPwd} onChange={e => setResetPwd(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleResetPwd} disabled={saving}>
                {saving ? <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <KeyRound size={13} />}
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
