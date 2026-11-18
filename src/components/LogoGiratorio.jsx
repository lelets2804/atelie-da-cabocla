import { motion } from 'framer-motion'

// Mandala dourada que gira devagar (logo da loja e do painel)
export default function LogoGiratorio({ className = 'h-8 w-8' }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="100" cy="100" r="92" stroke="#d4a24c" strokeWidth="5" strokeDasharray="12 18" />
      <circle cx="100" cy="100" r="68" stroke="#f0d28a" strokeWidth="4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse key={i} cx="100" cy="100" rx="68" ry="20" stroke="#d4a24c" strokeWidth="4" transform={`rotate(${i * 22.5} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="9" fill="#f0d28a" />
    </motion.svg>
  )
}