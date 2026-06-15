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
          <Code2 size={12} className="text-white" />
          <span className="uppercase tracking-widest font-semibold">Generated SQL</span>
        </div>
        <button onClick={copy} className="flex items-center gap-1 text-xs text-muted hover:text-white transition-colors">
          {copied ? <Check size={12} className="text-white" /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap bg-surface/80 px-4 py-3 font-mono text-xs leading-relaxed text-white">
        {sql}
      </pre>
    </div>
  )
}
