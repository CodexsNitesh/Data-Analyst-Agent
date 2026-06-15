import { ChevronRight } from 'lucide-react'
import Badge from '../ui/Badge'

const typeColor = (type) => {
  if (type.includes('int') || type.includes('float') || type.includes('numeric') || type.includes('double')) return 'blue'
  if (type.includes('date') || type.includes('time')) return 'yellow'
  if (type.includes('bool')) return 'green'
  return 'gray'
}

export default function SchemaViewer({ schema }) {
  if (!schema?.length) return <p className="text-muted text-sm">No schema info available.</p>

  return (
    <div className="space-y-1">
      {schema.map((col) => (
        <div key={col.name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-border/30 transition-colors">
          <ChevronRight size={12} className="text-muted" />
          <span className="text-sm text-white font-mono flex-1">{col.name}</span>
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