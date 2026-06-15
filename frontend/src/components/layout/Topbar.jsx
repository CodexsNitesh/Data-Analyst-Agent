import { Zap, Bell, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'
import { useState } from 'react'

export default function Topbar() {
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-panel/95 px-3 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white bg-white">
          <Zap size={14} className="text-black" fill="currentColor" />
        </div>
        <span className="truncate font-bold tracking-tight text-white">AI Sales Copilot</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="text-muted hover:text-white transition-colors">
          <Bell size={17} />
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-border sm:px-3"
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-xs font-bold text-white">
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm text-white hidden sm:block">{user?.full_name}</span>
            <Badge color={user?.plan === 'pro' ? 'blue' : 'gray'}>{user?.plan?.toUpperCase()}</Badge>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-border bg-panel py-1 shadow-2xl">
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
