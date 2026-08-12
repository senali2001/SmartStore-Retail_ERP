'use client'
import { useState, useEffect } from 'react'
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Percent, RefreshCw } from 'lucide-react'
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const API_BASE = 'http://localhost:8080/api'
const CATEGORY_COLORS = ['#059669', '#2563eb', '#7c3aed', '#d97706', '#db2777', '#0d9488']

const ChartCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="admin-card" style={{ padding: 20 }}>
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
)

const tooltipStyle = {
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: 10, fontSize: 12, boxShadow: 'var(--shadow-lg)',
}

export default function ReportsPage() {
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
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: 12, fontSize: 15, fontWeight: 500 }}>Loading reports database...</span>
      </div>
    )
  }

  const stats = data || {
    todayRevenue: 0, todayInvestment: 0, todayProfit: 0, todayDiscount: 0, profitPct: 0,
    monthRevenue: 0, yearRevenue: 0,
    topProducts: [], categoryBreakdown: [], monthlyChart: []
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Live calculated business intelligence from your supermarket database</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchStats}><RefreshCw size={14} /> Refresh</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: "Today's Revenue",  value: `Rs.${stats.todayRevenue.toLocaleString()}`,  icon: <DollarSign size={16} />,  color: '#059669' },
          { label: "Today's Profit",   value: `Rs.${stats.todayProfit.toLocaleString()}`,   icon: <TrendingUp size={16} />,  color: '#2563eb' },
          { label: 'Today\'s Investment', value: `Rs.${stats.todayInvestment.toLocaleString()}`, icon: <ShoppingBag size={16} />, color: '#7c3aed' },
          { label: 'Profit Percentage',  value: `${stats.profitPct}%`,                        icon: <Percent size={16} />,     color: '#d97706' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ChartCard title="Revenue vs Investment vs Profit" subtitle="Monthly 2026 breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.monthlyChart} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <defs>
                {[['#059669','rev'],['#2563eb','inv'],['#7c3aed','pro']].map(([c,k]) => (
                  <linearGradient key={k} id={`g${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `Rs.${v/1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n: any) => [`Rs.${Number(v).toLocaleString()}`, n]} />
              <Area type="monotone" dataKey="revenue"    stroke="#059669" strokeWidth={2} fill="url(#grev)" dot={false} />
              <Area type="monotone" dataKey="investment" stroke="#2563eb" strokeWidth={2} fill="url(#ginv)" dot={false} />
              <Area type="monotone" dataKey="profit"     stroke="#7c3aed" strokeWidth={2} fill="url(#gpro)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
            {[['#059669','Revenue'],['#2563eb','Investment'],['#7c3aed','Profit']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} /> {l}
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Monthly Net Profit Trend" subtitle="Net profit line chart for current year">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.monthlyChart} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `Rs.${v/1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`Rs.${Number(v).toLocaleString()}`, 'Profit']} />
              <Line type="monotone" dataKey="profit" stroke="#7c3aed" strokeWidth={3} dot={{ fill: '#7c3aed', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        <ChartCard title="Sales by Category">
          {stats.categoryBreakdown.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No category sales.</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={stats.categoryBreakdown} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" strokeWidth={0}>
                    {stats.categoryBreakdown.map((e: any, i: number) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                {stats.categoryBreakdown.map((c: any, i: number) => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length], display: 'inline-block' }} />
                      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </ChartCard>

        <ChartCard title="Product Revenue Performance" subtitle="Performances of top products this month">
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ fontSize: 13 }}>
              <thead>
                <tr>{['Product','Sold','Revenue','Investment','Profit','Margin'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {stats.topProducts.map((p: any) => (
                  <tr key={p.rank}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.productName}</td>
                    <td>{p.sold}</td>
                    <td style={{ color: 'var(--color-green)', fontWeight: 700 }}>Rs.{p.revenue.toLocaleString()}</td>
                    <td>Rs.{p.investment.toLocaleString()}</td>
                    <td style={{ color: 'var(--color-blue)', fontWeight: 600 }}>Rs.{p.profit.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div className="progress-bar" style={{ width: 70 }}>
                          <div className="progress-fill" style={{ width: `${p.margin}%`, background: p.margin >= 30 ? 'var(--color-green)' : 'var(--color-orange)' }} />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 12 }}>{p.margin}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
