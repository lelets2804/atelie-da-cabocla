import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export default function ConviteCadastro({ titulo, texto }) {
  const local = useLocation()
  const de = local.pathname + local.hash

  return (
    <motion.div
      className="mx-auto max-w-2xl rounded-3xl border border-ouro/30 bg-ameixa/40 p-8 text-center backdrop-blur sm:p-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-ouro/40 bg-noite/60 text-ouro-claro"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Lock className="h-9 w-9" strokeWidth={1.4} />
      </motion.div>

      <h3 className="mt-6 bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-2xl font-bold text-transparent sm:text-3xl">
        {titulo}
      </h3>
      <p className="mx-auto mt-3 max-w-md font-elegante text-xl text-creme/80">{texto}</p>

      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link to="/entrar" state={{ de, modo: 'criar' }}>
          <motion.span
            className="inline-block rounded-full bg-gradient-to-r from-ouro to-ouro-claro px-8 py-3 font-titulo text-xs font-bold tracking-widest text-noite"
            whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(212,162,76,0.6)' }}
            whileTap={{ scale: 0.95 }}
          >
            CRIAR MINHA CONTA
          </motion.span>
        </Link>
        <Link to="/entrar" state={{ de, modo: 'entrar' }}>
          <motion.span
            className="inline-block rounded-full border border-ouro px-8 py-3 font-titulo text-xs tracking-widest text-ouro-claro"
            whileHover={{ scale: 1.06, backgroundColor: 'rgba(212,162,76,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            JÁ TENHO CONTA
          </motion.span>
        </Link>
      </div>
    </motion.div>
  )
}