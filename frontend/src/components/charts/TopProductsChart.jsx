import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const COLORS = ['#22d3ee', '#34d399', '#a78bfa', '#fbbf24', '#fb7185']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-panel border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-white font-semibold">${payload[0]?.value?.toLocaleString()}</p>
    </div>
  )
}

export default function TopProductsChart({ data }) {
  if (!data?.length) return (
    <div className="h-48 flex items-center justify-center text-muted text-sm">
      No product data available
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="label" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={false} tickLine={false} width={50}
          tickFormatter={(v) => `$${v > 999 ? (v / 1000).toFixed(0) + 'k' : v}`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
