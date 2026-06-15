import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

export default function ForecastChart({ historical = [], forecast = [] }) {
  const combined = [
    ...historical.map((h) => ({ ...h, historical: h.value })),
    ...forecast.map((f) => ({ ...f, projected: f.value })),
  ]

  if (!combined.length) return (
    <div className="h-48 flex items-center justify-center text-muted text-sm">
      Insufficient data for forecast
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={combined} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
        <XAxis dataKey="period" tick={{ fill: '#8b949e', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} axisLine={false} tickLine={false} width={55}
          tickFormatter={(v) => `$${v > 999 ? (v / 1000).toFixed(0) + 'k' : v}`} />
        <Tooltip
          contentStyle={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8b949e' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#8b949e' }} />
        <Bar dataKey="historical" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Historical" />
        <Line dataKey="projected" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 3 }} name="Forecast" strokeDasharray="5 5" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}