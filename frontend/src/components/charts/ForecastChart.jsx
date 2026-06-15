import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const HISTORICAL_ACCENT = '#22d3ee'
const FORECAST_ACCENT = '#fbbf24'

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
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="period" tick={{ fill: '#a3a3a3', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#a3a3a3', fontSize: 11 }} axisLine={false} tickLine={false} width={55}
          tickFormatter={(v) => `$${v > 999 ? (v / 1000).toFixed(0) + 'k' : v}`} />
        <Tooltip
          contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#a3a3a3' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#a3a3a3' }} />
        <Bar dataKey="historical" fill={HISTORICAL_ACCENT} radius={[3, 3, 0, 0]} name="Historical" />
        <Line dataKey="projected" stroke={FORECAST_ACCENT} strokeWidth={2} dot={{ fill: FORECAST_ACCENT, r: 3 }} name="Forecast" strokeDasharray="5 5" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
