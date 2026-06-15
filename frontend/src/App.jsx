import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Datasets from './pages/Datasets'
import Chat from './pages/Chat'
import Analytics from './pages/Analytics'
import Billing from './pages/Billing'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/datasets" element={<AppLayout><Datasets /></AppLayout>} />
        <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
        <Route path="/billing" element={<AppLayout><Billing /></AppLayout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}