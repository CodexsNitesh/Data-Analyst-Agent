import { ChevronRight } from 'lucide-react'
import Badge from '../ui/Badge'

const typeColor = (type) => {
  if (type.includes('int') || type.includes('float') || type.includes('numeric') || type.includes('double')) return 'blue'
  if (type.includes('date') || type.includes('time')) return 'gray'
  if (type.includes('bool')) return 'gray'
  return 'gray'
}

export default function SchemaViewer({ schema }) {
  if (!schema?.length) return <p className="text-muted text-sm">No schema info available.</p>

  return (
    <div className="space-y-1">
      {schema.map((col) => (
        <div key={col.name} className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-border/30">
          <ChevronRight size={12} className="text-muted" />
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-white">{col.name}</span>
          <Badge color={typeColor(col.type)} className="font-mono text-xs">{col.type}</Badge>
          {col.sample_values?.length > 0 && (
            <span className="text-muted text-xs hidden sm:block truncate max-w-[120px]">
              e.g. {col.sample_values[0]}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
