import { motion } from 'framer-motion'

const SUAVE = [0.22, 1, 0.36, 1]

// Cabeçalho padrão das seções: número + rótulo pequeno, e o título grande
export default function TituloSecao({ numero, rotulo, children, className = '' }) {
  return (
    <div className={className}>
      <motion.p
        className="flex items-center gap-4 font-texto text-[11px] font-medium uppercase tracking-[0.32em] text-ouro"
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: SUAVE }}
      >
        {numero && <span className="font-elegante text-sm normal-case italic tracking-normal">{numero}</span>}
        <span className="h-px w-8 bg-ouro/50" />
        {rotulo}
      </motion.p>
      {/* Quem "vê" a rolagem é a caixa de fora: o título começa escondido dentro dela */}
      <motion.div
        className="mt-5 overflow-hidden pb-[0.1em]"
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, margin: '-60px' }}
      >
        <motion.h2
          className="font-elegante text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.015em] text-creme"
          variants={{ oculto: { y: '105%' }, visivel: { y: 0 } }}
          transition={{ duration: 1, ease: SUAVE }}
        >
          {children}
        </motion.h2>
      </motion.div>
    </div>
  )
}