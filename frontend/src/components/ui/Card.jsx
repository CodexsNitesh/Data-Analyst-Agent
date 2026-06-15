export default function Card({ children, className = '', ...props }) {
  return (
    <div
      {...props}
      className={`bg-panel border border-border rounded-2xl ${className}`}
    >
      {children}
    </div>
  )
}