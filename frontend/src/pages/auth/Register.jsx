import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { register } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Register() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', full_name: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await register(form)
      signIn(res.data.access_token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white bg-white">
            <Zap size={24} className="text-black" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-white">Get Started Free</h1>
          <p className="text-muted text-sm mt-1">Create your AI Sales Copilot account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-panel p-5 sm:p-6">
          <Input
            label="Full Name"
            placeholder="Jane Smith"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <p className="rounded-lg border border-white/30 bg-black px-3 py-2 text-sm text-white">{error}</p>}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>

          <p className="text-center text-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-white underline-offset-4 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
