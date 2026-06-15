import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Spinner from '../ui/Spinner'

export default function AppLayout({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <Spinner size={32} />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen flex-col bg-surface text-white">
      <Topbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
      </div>
    </div>
  )
}
