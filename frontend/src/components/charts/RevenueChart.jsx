import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const REVENUE_ACCENT = '#22d3ee'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-panel border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-muted mb-1">{label}</p>
      <p className="text-white font-semibold">${payload[0]?.value?.toLocaleString()}</p>
    </div>
  )
}

export default function RevenueChart({ data }) {
  if (!data?.length) return (
    <div className="h-48 flex items-center justify-center text-muted text-sm">
      No revenue trend data available
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={REVENUE_ACCENT} stopOpacity={0.28} />
            <stop offset="95%" stopColor={REVENUE_ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="label" tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={false} tickLine={false} width={50}
          tickFormatter={(v) => `$${v > 999 ? (v / 1000).toFixed(0) + 'k' : v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="value" stroke={REVENUE_ACCENT} fill="url(#revGrad)" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
