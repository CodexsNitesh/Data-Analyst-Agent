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
    { label: 'Datasets', value: datasets.length, icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Chat Sessions', value: sessions.length, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Total Rows', value: datasets.reduce((s, d) => s + d.row_count, 0).toLocaleString(), icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Plan', value: user?.plan?.toUpperCase(), icon: BarChart3, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
        <p className="text-muted text-sm mt-1">Here's what's happening with your sales data today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className={`p-5 border ${bg}`}>
            <div className={`w-9 h-9 rounded-xl border ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-muted uppercase tracking-widest">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
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
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-border cursor-pointer transition-colors">
                  <Database size={16} className="text-blue-400 flex-shrink-0" />
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

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
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
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-border cursor-pointer transition-colors">
                  <MessageSquare size={16} className="text-purple-400 flex-shrink-0" />
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