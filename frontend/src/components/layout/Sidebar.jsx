import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Database, MessageSquare, BarChart3, CreditCard } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/datasets', icon: Database, label: 'Datasets' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-panel/95 backdrop-blur md:sticky md:top-14 md:z-10 md:h-[calc(100vh-3.5rem)] md:w-56 md:flex-shrink-0 md:border-r md:border-t-0 md:bg-panel">
      <nav className="flex items-center justify-around gap-1 px-2 py-2 md:block md:space-y-1 md:px-3 md:py-4">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium transition-all md:flex-row md:gap-3 md:px-3 md:py-2.5 md:text-sm ${
                isActive
                  ? 'border border-white/30 bg-white text-black'
                  : 'text-muted hover:bg-border hover:text-white'
              }`
            }
          >
            <Icon size={16} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
