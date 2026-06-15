import { Table2, Trash2, Eye, MessageSquare, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function DatasetCard({ dataset, onDelete }) {
  const navigate = useNavigate()

  return (
    <Card className="p-5 hover:border-blue-500/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Table2 size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{dataset.name}</h3>
            <p className="text-muted text-xs font-mono">{dataset.table_name}</p>
          </div>
        </div>
        <button onClick={() => onDelete(dataset.id)} className="text-muted hover:text-red-400 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {dataset.description && (
        <p className="text-muted text-xs mb-3 line-clamp-2">{dataset.description}</p>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge color="blue">{dataset.row_count.toLocaleString()} rows</Badge>
        <Badge color="gray">{dataset.column_count} columns</Badge>
        <Badge color="gray">{fmtSize(dataset.file_size_bytes)}</Badge>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate(`/chat?dataset=${dataset.id}`)}>
          <MessageSquare size={12} /> Chat
        </Button>
        <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate(`/analytics?dataset=${dataset.id}`)}>
          <BarChart3 size={12} /> Analyze
        </Button>
      </div>
    </Card>
  )
}