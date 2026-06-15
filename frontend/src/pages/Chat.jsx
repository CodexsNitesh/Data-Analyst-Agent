import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, MessageSquare, ChevronRight } from 'lucide-react'
import { useDatasets } from '../hooks/useDatasets'
import { useChat } from '../hooks/useChat'
import { createSession, listSessions, getSession, deleteSession } from '../services/api'
import ChatBox from '../components/chat/ChatBox'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Chat() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { datasets } = useDatasets()
  const { messages, loading, send, loadHistory, reset } = useChat()

  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)
  const [selectedDataset, setSelectedDataset] = useState(searchParams.get('dataset') || '')
  const [sessionsLoading, setSessionsLoading] = useState(true)

  useEffect(() => {
    listSessions().then((r) => setSessions(r.data)).catch(() => {}).finally(() => setSessionsLoading(false))
  }, [])

  useEffect(() => {
    const sid = searchParams.get('session')
    if (sid) loadExistingSession(sid)
  }, [])

  const loadExistingSession = async (sessionId) => {
    try {
      const res = await getSession(sessionId)
      setActiveSession(res.data)
      setSelectedDataset(res.data.dataset_id)
      loadHistory(res.data.messages)
    } catch {}
  }

  const handleNewSession = async () => {
    if (!selectedDataset) return
    try {
      const res = await createSession({ dataset_id: selectedDataset, title: 'New Chat' })
      setActiveSession(res.data)
      reset()
      setSessions((prev) => [res.data, ...prev])
      navigate(`/chat?session=${res.data.id}`)
    } catch {}
  }

  const handleDeleteSession = async (id) => {
    if (!confirm('Delete this chat session?')) return
    await deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (activeSession?.id === id) {
      setActiveSession(null)
      reset()
    }
  }

  const handleSend = async (question) => {
    if (!activeSession) {
      await handleNewSession()
    }
    if (activeSession) await send(activeSession.id, question)
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Session Sidebar */}
      <div className="w-64 bg-panel border-r border-border flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">Dataset</p>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select dataset…</option>
            {datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <Button className="w-full mt-3" size="sm" onClick={handleNewSession} disabled={!selectedDataset}>
            <Plus size={13} /> New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessionsLoading ? <div className="flex justify-center mt-4"><Spinner size={20} /></div> : null}
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => loadExistingSession(s.id)}
              className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${activeSession?.id === s.id ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'hover:bg-border text-muted hover:text-white'}`}
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="text-sm truncate flex-1">{s.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id) }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        {activeSession ? (
          <div className="h-full flex flex-col">
            <div className="px-6 py-3 border-b border-border flex items-center gap-2">
              <MessageSquare size={15} className="text-blue-400" />
              <span className="text-sm text-white font-medium">{activeSession.title}</span>
              <ChevronRight size={14} className="text-muted" />
              <span className="text-sm text-muted">{datasets.find((d) => d.id === activeSession.dataset_id)?.name}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatBox messages={messages} loading={loading} onSend={(q) => send(activeSession.id, q)} disabled={false} />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <MessageSquare size={36} className="text-muted" />
            <div className="text-center">
              <p className="text-white font-semibold mb-1">No chat selected</p>
              <p className="text-muted text-sm">Select a dataset and start a new chat</p>
            </div>
            {selectedDataset && (
              <Button onClick={handleNewSession}><Plus size={14} /> New Chat</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}