import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table'
import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, Table2 } from 'lucide-react'

export default function ResultTable({ data }) {
  if (!data?.length) return null

  const columns = useMemo(() =>
    Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => {
        const v = info.getValue()
        return v === null || v === undefined
          ? <span className="text-muted italic text-xs">null</span>
          : String(v)
      },
    })), [data])

  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  })

  return (
    <div className="mt-3 rounded-xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-surface border-b border-border text-xs text-muted">
        <Table2 size={12} className="text-white" />
        <span className="uppercase tracking-widest font-semibold">Results</span>
        <span className="ml-auto">{data.length} row{data.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-border bg-panel">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-3 py-2 text-left font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr key={row.id} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-surface' : 'bg-panel/50'} transition-colors hover:bg-white/5`}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 font-mono text-white/80 whitespace-nowrap max-w-[180px] truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-3 py-2 bg-panel border-t border-border">
          <span className="text-xs text-muted">Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <div className="flex gap-1">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-border disabled:opacity-30">
              <ChevronLeft size={14} className="text-muted" />
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-border disabled:opacity-30">
              <ChevronRight size={14} className="text-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
