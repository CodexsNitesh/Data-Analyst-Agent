export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-muted font-medium">{label}</label>}
      <input
        {...props}
        className={`w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-white placeholder-muted text-sm focus:outline-none focus:border-blue-500 transition-colors ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}