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
      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Ask about your data</p>
              <p className="text-muted text-sm">Natural language to SQL — get instant answers</p>
            </div>
            <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => !disabled && onSend(s)}
                  disabled={disabled}
                  className="rounded-lg border border-border bg-panel px-3 py-2.5 text-left text-xs text-muted transition-all hover:border-white/50 hover:text-white disabled:opacity-40">
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
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Loader2 size={13} className="animate-spin text-black" />
                </div>
                <div className="rounded-lg rounded-bl-none border border-border bg-panel px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border px-4 pb-4 pt-3 sm:px-6 sm:pb-5">
        <div className="flex items-end gap-3 rounded-lg border border-border bg-panel px-3 py-3 transition-colors focus-within:border-white sm:px-4">
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
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white transition-colors hover:bg-neutral-200 disabled:opacity-40">
            {loading ? <Loader2 size={14} className="animate-spin text-black" /> : <Send size={14} className="text-black" />}
          </button>
        </div>
        <p className="text-center text-xs text-muted mt-2">Only SELECT queries are executed. All queries are validated.</p>
      </div>
    </div>
  )
}
