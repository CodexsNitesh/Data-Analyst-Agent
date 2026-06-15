import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { uploadDataset } from '../../services/api'

export default function UploadModal({ open, onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    if (!name) setName(f.name.replace('.csv', ''))
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f?.name.endsWith('.csv')) {
      setFile(f)
      if (!name) setName(f.name.replace('.csv', ''))
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (name) formData.append('name', name)
      if (description) formData.append('description', description)
      await uploadDataset(formData)
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setName('')
    setDescription('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Upload Dataset">
      {success ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <CheckCircle2 size={40} className="text-white" />
          <p className="text-white font-medium">Dataset uploaded successfully!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-white/60 sm:p-8"
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileSpreadsheet size={24} className="text-white" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{file.name}</p>
                  <p className="text-muted text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="ml-auto text-muted hover:text-white">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={28} className="text-muted mx-auto mb-3" />
                <p className="text-muted text-sm">Drop your CSV here or click to browse</p>
                <p className="text-muted text-xs mt-1">Max 50MB</p>
              </>
            )}
          </div>

          <Input label="Dataset Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 Sales Data" />
          <Input label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this dataset" />

          {error && <p className="rounded-lg border border-white/30 bg-black px-3 py-2 text-sm text-white">{error}</p>}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button variant="secondary" className="flex-1" onClick={handleClose}>Cancel</Button>
            <Button className="flex-1" onClick={handleSubmit} loading={loading} disabled={!file}>
              <Upload size={14} /> Upload
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
