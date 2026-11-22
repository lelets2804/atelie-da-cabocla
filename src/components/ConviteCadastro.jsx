import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import LogoGiratorio from './LogoGiratorio'

const SUAVE = [0.22, 1, 0.36, 1]

export default function ConviteCadastro({ titulo, texto }) {
  const local = useLocation()
  const de = local.pathname + local.hash

  return (
    <motion.div
      className="relative overflow-hidden border border-linha bg-musgo/60 p-8 sm:p-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: SUAVE }}
    >
      <LogoGiratorio className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-[0.07]" />

      <div className="relative max-w-xl">
        <h3 className="font-elegante text-3xl font-medium text-creme sm:text-4xl">{titulo}</h3>
        <p className="mt-3 font-texto text-sm leading-relaxed text-creme/60 sm:text-base">{texto}</p>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            to="/entrar"
            state={{ de, modo: 'criar' }}
            className="group inline-flex items-center gap-3 rounded-sm bg-creme px-6 py-3.5 font-texto text-xs font-semibold uppercase tracking-[0.2em] text-noite transition-colors hover:bg-ouro-claro"
          >
            Criar minha conta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/entrar"
            state={{ de, modo: 'entrar' }}
            className="font-texto text-xs font-semibold uppercase tracking-[0.2em] text-creme/70 underline decoration-ouro/60 underline-offset-[6px] transition-colors hover:text-creme"
          >
            Já tenho conta
          </Link>
        </div>
      </div>
    </motion.div>
  )
}