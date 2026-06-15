import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-white hover:bg-neutral-200 text-black border border-white',
  secondary: 'bg-panel border border-border hover:border-white/70 text-white',
  danger: 'bg-panel hover:bg-white/10 text-white border border-white/30',
  ghost: 'hover:bg-border text-muted hover:text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-3 text-sm rounded-lg',
}

export default function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  )
}
