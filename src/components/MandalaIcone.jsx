export default function MandalaIcone({ className = 'h-16 w-16' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="92" stroke="#d4a24c" strokeWidth="4" strokeDasharray="10 14" />
      <circle cx="100" cy="100" r="68" stroke="#f0d28a" strokeWidth="3" />
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse key={i} cx="100" cy="100" rx="68" ry="20" stroke="#d4a24c" strokeWidth="3" transform={`rotate(${i * 22.5} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="8" fill="#f0d28a" />
    </svg>
  )
}