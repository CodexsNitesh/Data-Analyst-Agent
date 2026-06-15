export default function Card({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`bg-panel border border-border rounded-lg ${className}`}
    >
      {children}
    </div>
  )
}
