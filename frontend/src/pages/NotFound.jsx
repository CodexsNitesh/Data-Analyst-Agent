import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-black text-white">404</p>
      <p className="text-muted text-sm">Page not found.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  )
}