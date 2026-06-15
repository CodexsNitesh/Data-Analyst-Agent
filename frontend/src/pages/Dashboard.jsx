import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, MessageSquare, Database, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDatasets } from '../hooks/useDatasets'
import { listSessions } from '../services/api'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import UploadModal from '../components/dataset/UploadModal'

export default function Dashboard() {
  const { user } = useAuth()
  const { datasets, loading, refetch } = useDatasets()
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [uploadOpen, setUploadOpen] = useState(false)

  useEffect(() => {
    listSessions().then((r) => setSessions(r.data)).catch(() => {})
  }, [])

  const stats = [
    { label: 'Datasets', value: datasets.length, icon: Database },
    { label: 'Chat Sessions', value: sessions.length, icon: MessageSquare },
    { label: 'Total Rows', value: datasets.reduce((s, d) => s + d.row_count, 0).toLocaleString(), icon: TrendingUp },
    { label: 'Plan', value: user?.plan?.toUpperCase(), icon: BarChart3 },
  ]

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-white sm:text-2xl">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
        <p className="text-muted text-sm mt-1">Here's what's happening with your sales data today.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mb-8 lg:grid-cols-4 lg:gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-white/10 p-4 sm:p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5">
              <Icon size={18} className="text-white" />
            </div>
            <p className="mb-1 break-words text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-muted uppercase tracking-widest">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">Recent Datasets</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/datasets')}>
              View all <ArrowRight size={13} />
            </Button>
          </div>
          {datasets.length === 0 ? (
            <div className="text-center py-8">
              <Database size={32} className="text-muted mx-auto mb-3" />
              <p className="text-muted text-sm mb-3">No datasets yet</p>
              <Button size="sm" onClick={() => setUploadOpen(true)}>
                <Plus size={13} /> Upload CSV
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {datasets.slice(0, 5).map((d) => (
                <div key={d.id} onClick={() => navigate(`/analytics?dataset=${d.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-border">
                  <Database size={16} className="flex-shrink-0 text-white" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{d.name}</p>
                    <p className="text-xs text-muted">{d.row_count.toLocaleString()} rows · {d.column_count} cols</p>
                  </div>
                  <ArrowRight size={14} className="text-muted" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">Recent Chats</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/chat')}>
              View all <ArrowRight size={13} />
            </Button>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={32} className="text-muted mx-auto mb-3" />
              <p className="text-muted text-sm mb-3">No chat sessions yet</p>
              <Button size="sm" variant="secondary" onClick={() => navigate('/chat')}>
                <MessageSquare size={13} /> Start Chatting
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 5).map((s) => (
                <div key={s.id} onClick={() => navigate(`/chat?session=${s.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-border">
                  <MessageSquare size={16} className="flex-shrink-0 text-white" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{s.title}</p>
                    <p className="text-xs text-muted">{new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                  <ArrowRight size={14} className="text-muted" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={refetch} />
    </div>
  )
}
