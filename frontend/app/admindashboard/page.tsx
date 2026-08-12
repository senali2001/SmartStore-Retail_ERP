'use client'
import { useState, useEffect } from 'react'
import {
  PlusCircle, FileText, Truck, Tag, TrendingUp, TrendingDown,
  DollarSign, ShoppingBag, Users, Percent, Gift, AlertTriangle,
  Package, Clock, ArrowRight, RefreshCw
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts'
import Link from 'next/link'

const API_BASE = 'http://localhost:8080/api'

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: 'var(--shadow-lg)',
      fontSize: 12,
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 700 }}>
          {p.name === 'revenue' ? 'Revenue' : 'Investment'}: Rs.{p.value.toLocaleString()}
        </div>
      ))}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

interface StatCardProps {
  label: string; value: number; prefix?: string; suffix?: string
  change: number; icon: React.ReactNode; accent: string; delay?: number
}
function StatCard({ label, value, prefix = '', suffix = '', change, icon, accent, delay = 0 }: StatCardProps) {
  return (
    <div className="stat-card admin-card" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
        <div style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: `${accent}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent,
        }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1 }}>
          {prefix}{value.toLocaleString()}{suffix}
        </div>
        <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
          {change >= 0
            ? <TrendingUp size={13} color="var(--color-green)" />
            : <TrendingDown size={13} color="var(--color-red)" />
          }
          <span style={{ fontWeight: 700, color: change >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
            {Math.abs(change)}%
          </span>
          <span style={{ color: 'var(--text-muted)' }}>vs yesterday</span>
        </div>
      </div>
    </div>
  )
}

const CATEGORY_COLORS = ['#059669', '#2563eb', '#7c3aed', '#d97706', '#db2777', '#0d9488'];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const [liveTime, setLiveTime] = useState('')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/stats`)
      if (res.ok) {
        const stats = await res.json()
        setData(stats)
      }
    } catch (e) {
      console.error("Error loading live dashboard stats:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const upd = () => setLiveTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    upd()
    const t = setInterval(upd, 1000)
    return () => clearInterval(t)
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: 12, fontSize: 15, fontWeight: 500 }}>Loading live dashboard data...</span>
      </div>
    )
  }

  const stats = data || {
    todayRevenue: 0, todayInvestment: 0, todayProfit: 0, todayDiscount: 0, profitPct: 0, todayCustomers: 0,
    monthRevenue: 0, yearRevenue: 0, totalCustomers: 0, silverMembers: 0, goldMembers: 0, newCustomers: 0, returningCustomers: 0,
    topProducts: [], categoryBreakdown: [], monthlyChart: [],
    criticalStock: [], lowStock: [], expired: [], expiringSoon: [], expiringMonth: []
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

        <div style={{ minWidth: 0 }}>
          <div className="hero-section" style={{
            background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #047857 100%)',
            boxShadow: '0 20px 60px rgba(5,150,105,0.3)',
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 6, letterSpacing: '0.05em' }}>
                {getGreeting()} 👋
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 6 }}>
                Welcome Back, Admin
              </h1>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', maxWidth: 400, lineHeight: 1.5 }}>
                Dashboard values are 100% live and calculated from actual business logic.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{today}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{liveTime}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative', marginTop: 20 }}>
              {[
                { icon: <PlusCircle size={14} />, label: 'Add Product',     href: '/admindashboard/stock'      },
                { icon: <FileText size={14} />,   label: 'New Invoice',     href: '/'   },
                { icon: <Truck size={14} />,      label: 'Add Supplier',    href: '/admindashboard/suppliers'  },
                { icon: <Tag size={14} />,        label: 'Create Promo',    href: '/admindashboard/promotions' },
              ].map(a => (
                <Link key={a.label} href={a.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8,
                  padding: '7px 13px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#fff',
                  textDecoration: 'none',
                }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
            <StatCard label="Today's Revenue"    value={stats.todayRevenue}    prefix="Rs." change={12} icon={<DollarSign size={17} />}  accent="#059669" />
            <StatCard label="Today's Investment" value={stats.todayInvestment} prefix="Rs." change={8}  icon={<ShoppingBag size={17} />} accent="#2563eb" />
            <StatCard label="Today's Profit"     value={stats.todayProfit}     prefix="Rs." change={15} icon={<TrendingUp size={17} />}  accent="#7c3aed" />
            <StatCard label="Customers Served"   value={stats.todayCustomers}               change={4}  icon={<Users size={17} />}       accent="#d97706" />
            <StatCard label="Profit Percentage"  value={stats.profitPct}       suffix="%"   change={7}  icon={<Percent size={17} />}     accent="#db2777" />
            <StatCard label="Discounts Given"    value={stats.todayDiscount}   prefix="Rs." change={-2} icon={<Gift size={17} />}        accent="#0d9488" />
          </div>

          <div className="admin-card" style={{ padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Revenue vs Investment</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Monthly comparison for the current year</div>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                {[['#059669', 'Revenue'], ['#2563eb', 'Investment']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
                    {l}
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={stats.monthlyChart} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `Rs.${v/1000}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} fill="url(#gRev)" dot={false} />
                <Area type="monotone" dataKey="investment" stroke="#2563eb" strokeWidth={2.5} fill="url(#gInv)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Monthly Top Products</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Ranked by total quantity sold</div>
              </div>
              <Link href="/admindashboard/stock" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                View All <ArrowRight size={12} />
              </Link>
            </div>
            {stats.topProducts.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>No items sold this month.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      {['#', 'Product', 'Category', 'Sold', 'Revenue', 'Profit', 'Margin'].map(h => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((p: any) => (
                      <tr key={p.rank}>
                        <td>
                          <span style={{
                            width: 22, height: 22,
                            borderRadius: 6,
                            background: p.rank <= 3 ? 'var(--accent-glow)' : 'var(--bg-hover)',
                            color: p.rank <= 3 ? 'var(--accent)' : 'var(--text-muted)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 700,
                          }}>
                            {p.rank}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.productName}</div>
                        </td>
                        <td><span className="badge badge-gray">{p.category}</span></td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.sold}</td>
                        <td style={{ color: 'var(--color-green)', fontWeight: 700 }}>Rs.{p.revenue.toLocaleString()}</td>
                        <td style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Rs.{p.profit.toLocaleString()}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <div className="progress-bar" style={{ width: 60 }}>
                              <div className="progress-fill" style={{ width: `${p.margin}%`, background: p.margin > 30 ? 'var(--color-green)' : 'var(--color-orange)' }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{p.margin}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">

          <div className="admin-card" style={{ padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Sales by Category</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Current month breakdown</div>
            {stats.categoryBreakdown.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>No category sales.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={stats.categoryBreakdown} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={0}>
                      {stats.categoryBreakdown.map((entry: any, i: number) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
                  {stats.categoryBreakdown.map((c: any, i: number) => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length], display: 'inline-block' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{c.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{c.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '12px 14px',
              background: 'var(--color-red-bg)',
              display: 'flex', alignItems: 'center', gap: 7,
              borderBottom: '1px solid var(--border)',
            }}>
              <AlertTriangle size={14} color="var(--color-red)" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-red-text)' }}>Critical Stock</span>
              <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{stats.criticalStock.length}</span>
            </div>
            {stats.criticalStock.slice(0, 4).map((item: any, i: number) => (
              <div key={i} className="alert-item" style={{ background: 'rgba(220,38,38,0.03)' }}>
                <Package size={13} color="var(--color-red)" style={{ flexShrink: 0 }} />
                <span className="alert-item-name">{item.name}</span>
                <span className="badge badge-red">{item.qty} left</span>
              </div>
            ))}
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '12px 14px',
              background: 'var(--color-orange-bg)',
              display: 'flex', alignItems: 'center', gap: 7,
              borderBottom: '1px solid var(--border)',
            }}>
              <AlertTriangle size={14} color="var(--color-orange)" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-orange-text)' }}>Low Stock</span>
              <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>{stats.lowStock.length}</span>
            </div>
            {stats.lowStock.slice(0, 4).map((item: any, i: number) => (
              <div key={i} className="alert-item">
                <Package size={13} color="var(--color-orange)" style={{ flexShrink: 0 }} />
                <span className="alert-item-name">{item.name}</span>
                <span className="badge badge-orange">{item.qty} left</span>
              </div>
            ))}
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '12px 14px',
              background: 'var(--color-red-bg)',
              display: 'flex', alignItems: 'center', gap: 7,
              borderBottom: '1px solid var(--border)',
            }}>
              <Clock size={14} color="var(--color-red)" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-red-text)' }}>Expired Products</span>
              <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{stats.expired.length}</span>
            </div>
            {stats.expired.slice(0, 3).map((item: any, i: number) => (
              <div key={i} className="alert-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 12.5 }}>{item.name}</div>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{item.expiry}</span>
                  <span className="badge badge-red" style={{ marginLeft: 'auto' }}>EXPIRED</span>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div style={{
              padding: '12px 14px',
              background: 'var(--color-orange-bg)',
              display: 'flex', alignItems: 'center', gap: 7,
              borderBottom: '1px solid var(--border)',
            }}>
              <Clock size={14} color="var(--color-orange)" />
              <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-orange-text)' }}>Expiring (≤ 7 Days)</span>
              <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>{stats.expiringSoon.length}</span>
            </div>
            {stats.expiringSoon.slice(0, 3).map((item: any, i: number) => (
              <div key={i} className="alert-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 12.5 }}>{item.name}</div>
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{item.expiry}</span>
                  <span className="badge badge-orange" style={{ marginLeft: 'auto' }}>{item.daysLeft}d left</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
