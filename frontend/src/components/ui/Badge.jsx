const colors = {
  blue: 'bg-white text-black border-white',
  green: 'bg-white text-black border-white',
  yellow: 'bg-white/10 text-white border-white/20',
  red: 'bg-black text-white border-white/30',
  gray: 'bg-white/5 text-muted border-border',
}

export default function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  )
}
