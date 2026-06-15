import { User, Zap, AlertTriangle, Clock } from 'lucide-react'
import SQLViewer from './SQLViewer'
import ResultTable from './ResultTable'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-3">
        <div className="max-w-[85%] rounded-lg rounded-br-none border border-white/25 bg-white px-4 py-3 text-sm leading-relaxed text-black sm:max-w-[75%]">
          {message.content}
        </div>
        <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center flex-shrink-0">
          <User size={13} className="text-muted" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white">
        <Zap size={13} className="text-black" fill="currentColor" />
      </div>
      <div className="min-w-0 flex-1 sm:max-w-[90%]">
        <div className={`rounded-lg rounded-bl-none px-4 py-3 text-sm leading-relaxed ${message.isError ? 'border border-white/30 bg-black text-white' : 'border border-border bg-panel text-white'}`}>
          {message.isError && <AlertTriangle size={13} className="inline mr-2 mb-0.5" />}
          {message.content}
        </div>
        {message.execution_time_ms && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted px-1">
            <Clock size={10} />
            <span>{message.execution_time_ms}ms</span>
          </div>
        )}
        {message.sql_query && <SQLViewer sql={message.sql_query} />}
        {message.query_result?.length > 0 && <ResultTable data={message.query_result} />}
      </div>
    </div>
  )
}
