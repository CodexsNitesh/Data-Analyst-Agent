import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Card from './ui/Card'

const trendIcon = { up: TrendingUp, down: TrendingDown, neutral: Minus }
const trendColor = { up: 'text-white', down: 'text-white', neutral: 'text-muted' }

export default function KPICard({ label, value, change_pct, trend = 'neutral' }) {
  const Icon = trendIcon[trend] || Minus
  const color = trendColor[trend] || 'text-muted'

  const formatted = typeof value === 'number'
    ? value > 1000 ? `$${(value / 1000).toFixed(1)}k` : String(value)
    : value

  return (
    <Card className="p-4 sm:p-5">
      <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-2">{label}</p>
      <p className="mb-1 break-words text-2xl font-bold text-white">{formatted}</p>
      {change_pct !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${color}`}>
          <Icon size={12} />
          <span>{Math.abs(change_pct).toFixed(1)}%</span>
        </div>
      )}
      {!change_pct && trend && (
        <div className={`flex items-center gap-1 text-xs ${color}`}>
          <Icon size={12} />
          <span className="capitalize">{trend}</span>
        </div>
      )}
    </Card>
  )
}
