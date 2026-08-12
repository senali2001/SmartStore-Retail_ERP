'use client'
import { useState } from 'react'
import {
  Settings, User, Building2, Store, MapPin, Receipt, Globe, Palette,
  Bell, Mail, MessageSquare, Shield, KeyRound, Database, FileText,
  ChevronRight, Check, Moon, Sun, Lock, Smartphone, RefreshCw
} from 'lucide-react'

const SECTIONS = [
  { id: 'profile',   icon: <User size={16} />,        label: 'Admin Profile'        },
  { id: 'company',   icon: <Building2 size={16} />,   label: 'Company Details'      },
  { id: 'store',     icon: <Store size={16} />,       label: 'Store Information'    },
  { id: 'tax',       icon: <Receipt size={16} />,     label: 'Tax Configuration'    },
  { id: 'theme',     icon: <Palette size={16} />,     label: 'Theme & Display'      },
  { id: 'notif',     icon: <Bell size={16} />,        label: 'Notifications'        },
  { id: 'email',     icon: <Mail size={16} />,        label: 'Email Settings'       },
  { id: 'sms',       icon: <MessageSquare size={16}/>,label: 'SMS Settings'         },
  { id: 'security',  icon: <Shield size={16} />,      label: 'Security'             },
  { id: 'backup',    icon: <Database size={16} />,    label: 'Backup & Restore'     },
  { id: 'audit',     icon: <FileText size={16} />,    label: 'Audit Logs'           },
]

const Toggle = ({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>}
    </div>
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24,
        borderRadius: 99,
        background: value ? 'var(--accent)' : 'var(--border-light)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3, left: value ? 22 : 3,
        width: 18, height: 18,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        transition: 'left 0.2s',
        display: 'block',
      }} />
    </button>
  </div>
)

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@smartstore.lk', phone: '0771234567', username: 'admin' })
  const [company, setCompany] = useState({ name: 'SmartStore Pvt Ltd', reg: 'PV 00012345', address: '45 Main Street, Colombo 3', country: 'Sri Lanka' })
  const [store, setStore] = useState({ storeName: 'SmartStore - Main Branch', currency: 'LKR', timezone: 'Asia/Colombo', language: 'English' })
  const [tax, setTax] = useState({ vatRate: '15', vatEnabled: true, regNo: 'VAT-1234567' })
  const [notifs, setNotifs] = useState({ lowStock: true, newOrder: true, expiryAlert: true, dailyReport: false, smsAlerts: true })
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: '30' })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff' }}>A</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{profile.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{profile.email}</div>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>Change Photo</button>
                </div>
              </div>
              <div className="form-grid-2">
                {[['Full Name', 'name', 'text'], ['Username', 'username', 'text'], ['Email', 'email', 'email'], ['Phone', 'phone', 'tel']].map(([l, k, t]) => (
                  <div className="input-group" key={k}>
                    <label className="input-label">{l}</label>
                    <input className="admin-input" type={t} value={(profile as any)[k]} onChange={e => setProfile(p => ({ ...p, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'company':
        return (
          <div className="form-grid-2">
            {[['Company Name', 'name'], ['Registration No.', 'reg'], ['Address', 'address'], ['Country', 'country']].map(([l, k]) => (
              <div className="input-group" key={k}>
                <label className="input-label">{l}</label>
                <input className="admin-input" value={(company as any)[k]} onChange={e => setCompany(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
        )

      case 'store':
        return (
          <div className="form-grid-2">
            {[
              { l: 'Store Name', k: 'storeName' },
              { l: 'Currency', k: 'currency' },
              { l: 'Timezone', k: 'timezone' },
              { l: 'Language', k: 'language' },
            ].map(({ l, k }) => (
              <div className="input-group" key={k}>
                <label className="input-label">{l}</label>
                <input className="admin-input" value={(store as any)[k]} onChange={e => setStore(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
        )

      case 'tax':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Toggle label="Enable VAT" desc="Apply VAT to all eligible products" value={tax.vatEnabled} onChange={v => setTax(p => ({ ...p, vatEnabled: v }))} />
            <div className="form-grid-2">
              <div className="input-group">
                <label className="input-label">VAT Rate (%)</label>
                <input className="admin-input" type="number" value={tax.vatRate} onChange={e => setTax(p => ({ ...p, vatRate: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">VAT Registration No.</label>
                <input className="admin-input" value={tax.regNo} onChange={e => setTax(p => ({ ...p, regNo: e.target.value }))} />
              </div>
            </div>
          </div>
        )

      case 'theme':
        return (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Color Theme</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[['#059669','Emerald (Default)'],['#2563eb','Blue'],['#7c3aed','Purple'],['#d97706','Amber']].map(([c, n]) => (
                  <button key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: c, border: c === '#059669' ? `3px solid ${c}` : '3px solid transparent', outline: c === '#059669' ? `2px solid var(--border-light)` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c === '#059669' && <Check size={16} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
            <Toggle label="Dark Mode" desc="Enable dark theme across all pages" value={false} onChange={() => { document.documentElement.getAttribute('data-theme') === 'dark' ? document.documentElement.removeAttribute('data-theme') : document.documentElement.setAttribute('data-theme','dark') }} />
          </div>
        )

      case 'notif':
        return (
          <div>
            <Toggle label="Low Stock Alerts"    desc="Notify when products fall below minimum level"  value={notifs.lowStock}     onChange={v => setNotifs(p => ({...p, lowStock: v}))} />
            <Toggle label="New Order Received"  desc="Real-time notification for every new order"     value={notifs.newOrder}     onChange={v => setNotifs(p => ({...p, newOrder: v}))} />
            <Toggle label="Expiry Alerts"       desc="Warn about products expiring within 7 days"     value={notifs.expiryAlert}  onChange={v => setNotifs(p => ({...p, expiryAlert: v}))} />
            <Toggle label="Daily Report Email"  desc="Send automated daily summary to admin email"    value={notifs.dailyReport}  onChange={v => setNotifs(p => ({...p, dailyReport: v}))} />
            <Toggle label="SMS Alerts"          desc="Send critical alerts via SMS"                   value={notifs.smsAlerts}    onChange={v => setNotifs(p => ({...p, smsAlerts: v}))} />
          </div>
        )

      case 'security':
        return (
          <div>
            <Toggle label="Two-Factor Authentication" desc="Require OTP on every admin login" value={security.twoFactor} onChange={v => setSecurity(p => ({...p, twoFactor: v}))} />
            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Change Password</div>
              <div className="form-grid-2">
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <input className="admin-input" type="password" placeholder="••••••••" />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input className="admin-input" type="password" placeholder="Min. 8 characters" />
                </div>
              </div>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }}><KeyRound size={13} /> Update Password</button>
            </div>
            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Session Timeout</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Auto-logout after inactivity</div>
              <select className="admin-select" value={security.sessionTimeout} onChange={e => setSecurity(p => ({...p, sessionTimeout: e.target.value}))} style={{ width: 200 }}>
                {['15','30','60','120'].map(v => <option key={v} value={v}>{v} minutes</option>)}
              </select>
            </div>
          </div>
        )

      case 'backup':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { icon: <Database size={18} />, title: 'Backup Database', desc: 'Create a full backup of all store data', btn: 'Backup Now', color: '#059669' },
              { icon: <RefreshCw size={18} />, title: 'Restore Database', desc: 'Restore from a previously saved backup file', btn: 'Restore', color: '#2563eb' },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--bg-hover)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>{item.desc}</div>
                </div>
                <button className="btn btn-primary btn-sm" style={{ background: item.color, borderColor: item.color }}>{item.btn}</button>
              </div>
            ))}
          </div>
        )

      case 'audit':
        return (
          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <table className="admin-table">
              <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Module</th></tr></thead>
              <tbody>
                {[
                  ['2026-07-15 14:30', 'admin',   'LOGIN',          'Authentication'],
                  ['2026-07-15 14:28', 'admin',   'CREATE USER',    'Staff Management'],
                  ['2026-07-15 13:55', 'mgr01',   'UPDATE STOCK',   'Inventory'],
                  ['2026-07-15 12:10', 'cash01',  'CREATE INVOICE', 'Billing'],
                  ['2026-07-15 11:42', 'admin',   'DELETE PRODUCT', 'Stock Management'],
                ].map(([t, u, a, m], i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{t}</td>
                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{u}</td>
                    <td><span className="badge badge-gray">{a}</span></td>
                    <td style={{ fontSize: 12.5 }}>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return (
          <div className="empty-state">
            <div className="empty-state-icon"><Settings size={24} /></div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Settings section coming soon</div>
          </div>
        )
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your SmartStore system preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? <><Check size={14} /> Saved!</> : <><Settings size={14} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        <div className="admin-card" style={{ padding: '8px 0', height: 'fit-content' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                background: activeSection === s.id ? 'var(--accent-glow)' : 'transparent',
                border: 'none',
                borderLeft: `2.5px solid ${activeSection === s.id ? 'var(--accent)' : 'transparent'}`,
                color: activeSection === s.id ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: activeSection === s.id ? 600 : 400,
                fontFamily: 'var(--font)',
                transition: 'var(--t-fast)',
              }}
              onMouseEnter={e => { if (activeSection !== s.id) { (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)' } }}
              onMouseLeave={e => { if (activeSection !== s.id) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' } }}
            >
              {s.icon}
              <span style={{ flex: 1 }}>{s.label}</span>
              {activeSection === s.id && <ChevronRight size={12} />}
            </button>
          ))}
        </div>

        <div className="admin-card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
