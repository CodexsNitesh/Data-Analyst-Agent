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
    <div className="flex min-h-[calc(100vh-7rem)] flex-col md:h-[calc(100vh-3.5rem)] md:flex-row md:overflow-hidden">
      {/* Session Sidebar */}
      <div className="flex max-h-72 flex-shrink-0 flex-col border-b border-border bg-panel md:max-h-none md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-border p-4">
          <p className="text-xs text-muted uppercase tracking-widest font-semibold mb-3">Dataset</p>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
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
              className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${activeSession?.id === s.id ? 'border border-white/30 bg-white text-black' : 'text-muted hover:bg-border hover:text-white'}`}
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="text-sm truncate flex-1">{s.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id) }}
                className="opacity-60 transition-all hover:text-white group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="min-h-[34rem] flex-1 overflow-hidden md:min-h-0">
        {activeSession ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 sm:px-6">
              <MessageSquare size={15} className="flex-shrink-0 text-white" />
              <span className="truncate text-sm font-medium text-white">{activeSession.title}</span>
              <ChevronRight size={14} className="text-muted" />
              <span className="truncate text-sm text-muted">{datasets.find((d) => d.id === activeSession.dataset_id)?.name}</span>
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
