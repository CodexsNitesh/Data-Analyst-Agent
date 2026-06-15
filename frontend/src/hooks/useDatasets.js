import { useState, useEffect, useCallback } from 'react'
import { listDatasets } from '../services/api'

export function useDatasets() {
  const [datasets, setDatasets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listDatasets()
      setDatasets(res.data.datasets)
    } catch (e) {
      setError('Failed to load datasets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { datasets, loading, error, refetch: fetch }
}