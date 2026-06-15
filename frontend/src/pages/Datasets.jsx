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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Datasets</h1>
          <p className="text-muted text-sm mt-1">Upload and manage your CSV datasets</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus size={15} /> Upload CSV
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search datasets..."
          className="w-full max-w-md pl-10 pr-4 py-2.5 rounded-xl bg-panel border border-border text-white text-sm placeholder-muted focus:outline-none focus:border-blue-500 transition-colors"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => <DatasetCard key={d.id} dataset={d} onDelete={handleDelete} />)}
        </div>
      )}

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={refetch} />
    </div>
  )
}