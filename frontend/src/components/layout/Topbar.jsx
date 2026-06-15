import { Zap, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'
import { useState } from 'react'

export default function Topbar() {
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="h-14 bg-panel border-b border-border flex items-center justify-between px-6 flex-shrink-0 relative z-20">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
          <Zap size={14} className="text-white" fill="currentColor" />
        </div>
        <span className="font-bold text-white tracking-tight">AI Sales Copilot</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted hover:text-white transition-colors">
          <Bell size={17} />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-border px-3 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-white hidden sm:block">{user?.full_name}</span>
            <Badge color={user?.plan === 'pro' ? 'blue' : 'gray'}>{user?.plan?.toUpperCase()}</Badge>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-panel border border-border rounded-xl shadow-2xl z-20 py-1">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm text-white font-medium">{user?.full_name}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                </div>
                <button className="w-full text-left px-3 py-2 text-sm text-muted hover:text-white hover:bg-border transition-colors" onClick={signOut}>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}