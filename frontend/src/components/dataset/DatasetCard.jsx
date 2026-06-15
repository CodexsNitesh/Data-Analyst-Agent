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
    <Card className="p-4 transition-colors hover:border-white/40 sm:p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/5">
            <Table2 size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{dataset.name}</h3>
            <p className="text-muted text-xs font-mono">{dataset.table_name}</p>
          </div>
        </div>
        <button onClick={() => onDelete(dataset.id)} className="text-muted transition-colors hover:text-white">
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

      <div className="flex flex-col gap-2 sm:flex-row">
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
