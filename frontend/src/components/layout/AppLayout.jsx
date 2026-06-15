import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Spinner from '../ui/Spinner'

export default function AppLayout({ children }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <Spinner size={32} />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}