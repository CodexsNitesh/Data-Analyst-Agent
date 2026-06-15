import { useState } from 'react'
import { Code2, Copy, Check } from 'lucide-react'

export default function SQLViewer({ sql }) {
  const [copied, setCopied] = useState(false)
  if (!sql) return null

  const copy = () => {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mt-3 rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Code2 size={12} className="text-blue-400" />
          <span className="uppercase tracking-widest font-semibold">Generated SQL</span>
        </div>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-muted hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="px-4 py-3 text-xs font-mono text-blue-300 bg-surface/80 overflow-x-auto leading-relaxed whitespace-pre-wrap">
        {sql}
      </pre>
    </div>
  )
}