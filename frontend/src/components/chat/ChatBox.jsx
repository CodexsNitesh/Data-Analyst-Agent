import { useRef, useEffect, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import MessageBubble from './MessageBubble'

const SUGGESTIONS = [
  'Show total revenue by month',
  'Who are the top 5 customers?',
  'What are the best-selling products?',
  'Show average order value',
]

export default function ChatBox({ messages, loading, onSend, disabled }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef()
  const textareaRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    const q = input.trim()
    if (!q || loading || disabled) return
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    onSend(q)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Ask about your data</p>
              <p className="text-muted text-sm">Natural language to SQL — get instant answers</p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => !disabled && onSend(s)}
                  disabled={disabled}
                  className="bg-panel border border-border hover:border-blue-500/40 text-left text-xs px-3 py-2.5 rounded-xl text-muted hover:text-white transition-all disabled:opacity-40">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                  <Loader2 size={13} className="text-white animate-spin" />
                </div>
                <div className="bg-panel border border-border px-4 py-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 pb-5 pt-3 border-t border-border">
        <div className="flex items-end gap-3 bg-panel border border-border rounded-2xl px-4 py-3 focus-within:border-blue-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading || disabled}
            placeholder={disabled ? 'Select a dataset to start chatting' : 'Ask anything about your data…'}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-muted resize-none outline-none max-h-32 disabled:cursor-not-allowed"
            style={{ lineHeight: '1.5' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = e.target.scrollHeight + 'px'
            }}
          />
          <button onClick={handleSend} disabled={loading || !input.trim() || disabled}
            className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-blue-400 transition-colors">
            {loading ? <Loader2 size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
          </button>
        </div>
        <p className="text-center text-xs text-muted mt-2">Only SELECT queries are executed. All queries are validated.</p>
      </div>
    </div>
  )
}