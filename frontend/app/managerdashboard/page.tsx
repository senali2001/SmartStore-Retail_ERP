'use client'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  ShoppingCart, DollarSign, Users, Package,
  TrendingUp, Clock, CheckCircle, AlertCircle, MoreHorizontal
} from 'lucide-react'
import StatCard from './StatCard'

const revenueData = [
  { month: 'Oct', revenue: 42000, orders: 320 },
  { month: 'Nov', revenue: 55000, orders: 410 },
  { month: 'Dec', revenue: 78000, orders: 580 },
  { month: 'Jan', revenue: 61000, orders: 440 },
  { month: 'Feb', revenue: 69000, orders: 490 },
  { month: 'Mar', revenue: 84500, orders: 610 },
]

const categoryData = [
  { name: 'Electronics', value: 38, color: '#3b82f6' },
  { name: 'Apparel', value: 24, color: '#8b5cf6' },
  { name: 'Groceries', value: 19, color: '#10b981' },
  { name: 'Home & Living', value: 12, color: '#f59e0b' },
  { name: 'Others', value: 7, color: '#6b7280' },
]

const topProducts = [
  { name: 'Sony WH-1000XM5', sku: 'EL-44821', sold: 1240, revenue: '$186,000', stock: 82, status: 'healthy' },
  { name: 'Nike Air Max 270', sku: 'AP-22910', sold: 980, revenue: '$147,000', stock: 14, status: 'low' },
  { name: 'Instant Pot Duo', sku: 'HL-31540', sold: 870, revenue: '$130,500', stock: 56, status: 'healthy' },
  { name: 'Apple Watch S9', sku: 'EL-50021', sold: 760, revenue: '$380,000', stock: 0, status: 'out' },
  { name: 'Levi\'s 501 Jeans', sku: 'AP-18730', sold: 650, revenue: '$45,500', stock: 203, status: 'healthy' },
]

const recentOrders = [
  { id: '#ORD-9821', customer: 'Sarah Mitchell', items: 3, total: '$284.50', status: 'Delivered', time: '2m ago' },
  { id: '#ORD-9820', customer: 'James Patel', items: 1, total: '$499.00', status: 'Processing', time: '8m ago' },
  { id: '#ORD-9819', customer: 'Emma Chu', items: 5, total: '$122.80', status: 'Shipped', time: '14m ago' },
  { id: '#ORD-9818', customer: 'Carlos Reyes', items: 2, total: '$76.40', status: 'Pending', time: '22m ago' },
  { id: '#ORD-9817', customer: 'Priya Anand', items: 4, total: '$348.90', status: 'Delivered', time: '35m ago' },
]

const statusColors: Record<string, string> = {
  Delivered: '#10b981',
  Processing: '#3b82f6',
  Shipped: '#8b5cf6',
  Pending: '#f59e0b',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 12,
      }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
            {p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : `${p.value} orders`}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Total Revenue" value="$84,520" change="18.4%" positive accentColor="#3b82f6" icon={<DollarSign size={16} />} />
        <StatCard label="Total Orders" value="2,841" change="12.1%" positive accentColor="#10b981" icon={<ShoppingCart size={16} />} />
        <StatCard label="Active Customers" value="14,302" change="7.6%" positive accentColor="#8b5cf6" icon={<Users size={16} />} />
        <StatCard label="Stock Alerts" value="17" change="3 items" positive={false} accentColor="#f59e0b" icon={<Package size={16} />} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Revenue & Orders</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Oct 2025 – Mar 2026</div>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11.5 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /> Revenue
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: '#8b5cf6', display: 'inline-block' }} /> Orders
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} fill="url(#ordGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Sales by Category</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 16 }}>This month</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={42} outerRadius={65}
                dataKey="value" strokeWidth={0}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
            {categoryData.map((c) => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Top Products</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Best performing this month</div>
            </div>
            <button style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 7, padding: '5px 10px', fontSize: 11.5, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              View All
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                {['Product', 'SKU', 'Sold', 'Revenue', 'Stock'].map(h => (
                  <th key={h} style={{
                    padding: '9px 16px',
                    fontSize: 11, fontWeight: 600,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    background: 'var(--bg-secondary)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{p.name}</td>
                  <td style={{ padding: '11px 16px', fontSize: 11.5, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p.sku}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.sold.toLocaleString()}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 600, color: 'var(--accent-green)' }}>{p.revenue}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 600,
                      padding: '3px 9px', borderRadius: 99,
                      background: p.status === 'healthy' ? '#10b98122' : p.status === 'low' ? '#f59e0b22' : '#ef444422',
                      color: p.status === 'healthy' ? '#10b981' : p.status === 'low' ? '#f59e0b' : '#ef4444',
                    }}>
                      {p.status === 'out' ? 'Out of Stock' : p.status === 'low' ? `Low (${p.stock})` : p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '18px 0 0',
        }}>
          <div style={{ padding: '0 20px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Orders</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Live feed</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          </div>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {recentOrders.map((order, i) => (
              <div key={i} style={{
                padding: '13px 20px',
                borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 6,
                transition: 'background 0.15s',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', fontFamily: 'monospace' }}>{order.id}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 99,
                    background: `${statusColors[order.status]}22`,
                    color: statusColors[order.status],
                  }}>{order.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{order.customer}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{order.total}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.items} item{order.items > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={10} /> {order.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
