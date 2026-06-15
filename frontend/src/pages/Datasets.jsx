import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { useDatasets } from '../hooks/useDatasets'
import { deleteDataset } from '../services/api'
import DatasetCard from '../components/dataset/DatasetCard'
import UploadModal from '../components/dataset/UploadModal'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Datasets() {
  const { datasets, loading, refetch } = useDatasets()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [search, setSearch] = useState('')

  const handleDelete = async (id) => {
    if (!confirm('Delete this dataset? This cannot be undone.')) return
    await deleteDataset(id)
    refetch()
  }

  const filtered = datasets.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">Datasets</h1>
          <p className="text-muted text-sm mt-1">Upload and manage your CSV datasets</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="w-full sm:w-auto">
          <Plus size={15} /> Upload CSV
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search datasets..."
          className="w-full rounded-lg border border-border bg-panel py-2.5 pl-10 pr-4 text-sm text-white placeholder-muted transition-colors focus:border-white focus:outline-none sm:max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size={28} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted text-sm mb-3">{search ? 'No datasets match your search.' : 'No datasets uploaded yet.'}</p>
          {!search && <Button onClick={() => setUploadOpen(true)}><Plus size={14} /> Upload your first CSV</Button>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => <DatasetCard key={d.id} dataset={d} onDelete={handleDelete} />)}
        </div>
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={refetch} />
    </div>
  )
}
