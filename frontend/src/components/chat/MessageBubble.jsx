import { User, Zap, AlertTriangle, Clock } from 'lucide-react'
import SQLViewer from './SQLViewer'
import ResultTable from './ResultTable'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-end gap-3 justify-end">
        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-none bg-blue-500/10 border border-blue-500/20 text-white text-sm leading-relaxed">
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
      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
        <Zap size={13} className="text-white" fill="currentColor" />
      </div>
      <div className="max-w-[90%] min-w-0 flex-1">
        <div className={`px-4 py-3 rounded-2xl rounded-bl-none text-sm leading-relaxed ${message.isError ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-panel border border-border text-white'}`}>
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