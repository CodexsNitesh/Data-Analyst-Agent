export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-muted font-medium">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg bg-surface border border-border text-white placeholder-muted text-sm focus:outline-none focus:border-white transition-colors ${error ? 'border-white' : ''} ${className}`}
      />
      {error && <p className="text-xs text-white">{error}</p>}
    </div>
  )
}
