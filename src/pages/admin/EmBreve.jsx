import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'

export default function EmBreve({ titulo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent">
        {titulo}
      </h1>
      <div className="mt-2 h-px w-24 bg-ouro" />

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <motion.div
          className="text-ouro-claro"
          animate={{ rotate: [-12, 12, -12] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Hammer className="h-14 w-14" strokeWidth={1.2} />
        </motion.div>
        <p className="font-elegante text-2xl italic text-creme/70">
          Esta área está sendo construída.
        </p>
      </div>
    </motion.div>
  )
}