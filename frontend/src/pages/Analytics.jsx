import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BarChart3, Lightbulb, TrendingUp, RefreshCw } from 'lucide-react'
import { useDatasets } from '../hooks/useDatasets'
import { getAnalyticsSummary, getInsights, getForecast } from '../services/api'
import KPICard from '../components/KPICard'
import RevenueChart from '../components/charts/RevenueChart'
import TopProductsChart from '../components/charts/TopProductsChart'
import ForecastChart from '../components/charts/ForecastChart'
import SchemaViewer from '../components/dataset/SchemaViewer'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

export default function Analytics() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { datasets } = useDatasets()
  const [selectedId, setSelectedId] = useState(searchParams.get('dataset') || '')
  const [summary, setSummary] = useState(null)
  const [insights, setInsights] = useState([])
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [insightsLoading, setInsightsLoading] = useState(false)

  const load = async (id) => {
    if (!id) return
    setLoading(true)
    try {
      const [s, f] = await Promise.all([getAnalyticsSummary(id), getForecast(id)])
      setSummary(s.data)
      setForecast(f.data)
    } catch {}
    finally { setLoading(false) }
  }

  const loadInsights = async (id) => {
    if (!id) return
    setInsightsLoading(true)
    try {
      const res = await getInsights(id)
      setInsights(res.data.insights)
    } catch {}
    finally { setInsightsLoading(false) }
  }

  useEffect(() => {
    if (selectedId) {
      setSearchParams({ dataset: selectedId })
      load(selectedId)
      loadInsights(selectedId)
    }
  }, [selectedId])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-muted text-sm mt-1">Explore KPIs, trends, and AI insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-panel border border-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select dataset…</option>
            {datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={() => load(selectedId)} disabled={!selectedId}>
            <RefreshCw size={13} />
          </Button>
        </div>
      </div>

      {!selectedId ? (
        <div className="text-center py-20">
          <BarChart3 size={40} className="text-muted mx-auto mb-3" />
          <p className="text-muted text-sm">Select a dataset to view analytics</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : (
        <>
          {/* KPIs */}
          {summary?.kpis?.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {summary.kpis.map((kpi) => <KPICard key={kpi.label} {...kpi} />)}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-5">
              <h2 className="font-semibold text-white mb-4">Revenue Trend</h2>
              <RevenueChart data={summary?.revenue_trend} />
            </Card>
            <Card className="p-5">
              <h2 className="font-semibold text-white mb-4">Top Products</h2>
              <TopProductsChart data={summary?.top_products} />
            </Card>
          </div>

          <Card className="p-5 mb-6">
            <h2 className="font-semibold text-white mb-4">Sales Forecast</h2>
            <ForecastChart historical={forecast?.historical} forecast={forecast?.forecast} />
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white flex items-center gap-2">
                  <Lightbulb size={16} className="text-yellow-400" /> AI Insights
                </h2>
                <Button variant="secondary" size="sm" onClick={() => loadInsights(selectedId)} loading={insightsLoading}>
                  Refresh
                </Button>
              </div>
              {insightsLoading ? (
                <div className="flex justify-center py-8"><Spinner /></div>
              ) : insights.length === 0 ? (
                <p className="text-muted text-sm">No insights yet. Click Refresh to generate.</p>
              ) : (
                <ul className="space-y-3">
                  {insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="text-yellow-400 font-bold mt-0.5">{i + 1}.</span>
                      <span className="leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="font-semibold text-white mb-4">Schema</h2>
              <SchemaViewer schema={summary?.schema} />
            </Card>
          </div>
        </>
      )}
    </div>
  )
}