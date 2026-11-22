import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// O 3D só é baixado depois que a página aparece, para o site abrir rápido
const Guia3D = lazy(() => import('./Guia3D'))

const SUAVE = [0.22, 1, 0.36, 1]

const LINHAS_TITULO = [
  { texto: 'Feito à mão,' },
  { texto: 'com fé' },
  { texto: 'e axé.', destaque: true },
]

const PILARES = [
  { titulo: 'Feito à mão', texto: 'Cada peça é produzida uma a uma.' },
  { titulo: 'Com fé e respeito', texto: 'Tradição em cada detalhe.' },
  { titulo: 'Sob encomenda', texto: 'Personalizamos do seu jeito.' },
]

export default function Hero() {
  const secao = useRef(null)
  const { scrollYProgress } = useScroll({ target: secao, offset: ['start start', 'end start'] })
  const subirTexto = useTransform(scrollYProgress, [0, 1], [0, -120])
  const sumirTexto = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const descer3D = useTransform(scrollYProgress, [0, 1], [0, 160])
  const encolher3D = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  return (
    <section ref={secao} className="relative overflow-hidden">
      {/* Halo bem discreto atrás da guia */}
      <div className="pointer-events-none absolute right-[-10%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-verde/15 blur-[120px]" />

      <div className="relative mx-auto grid min-h-svh max-w-7xl grid-cols-1 items-center gap-6 px-6 pb-28 pt-28 lg:grid-cols-12 lg:pt-24">
        {/* Texto */}
        <motion.div className="relative z-10 lg:col-span-6" style={{ y: subirTexto, opacity: sumirTexto }}>
          <motion.p
            className="flex items-center gap-4 font-texto text-[11px] font-medium uppercase tracking-[0.32em] text-ouro"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: SUAVE, delay: 0.2 }}
          >
            <span className="h-px w-10 bg-ouro/60" />
            Artigos religiosos artesanais
          </motion.p>

          <h1 className="mt-8 font-elegante text-[clamp(3.4rem,8vw,7.25rem)] font-medium leading-[0.92] tracking-[-0.02em] text-creme">
            {LINHAS_TITULO.map((linha, i) => (
              <span key={linha.texto} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`block ${linha.destaque ? 'italic text-ouro-claro' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: SUAVE, delay: 0.35 + i * 0.12 }}
                >
                  {linha.texto}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-md font-texto text-base leading-relaxed text-creme/65 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SUAVE, delay: 0.9 }}
          >
            Guias, brajás, pulseiras e peças personalizadas, produzidas com cuidado para acompanhar a sua caminhada.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: SUAVE, delay: 1.05 }}
          >
            <a
              href="#colecao"
              className="group inline-flex items-center gap-3 rounded-sm bg-creme px-7 py-4 font-texto text-xs font-semibold uppercase tracking-[0.2em] text-noite transition-colors duration-300 hover:bg-ouro-claro"
            >
              Ver coleção
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <Link
              to="/#contato"
              className="group relative font-texto text-xs font-semibold uppercase tracking-[0.2em] text-creme/80 transition-colors hover:text-creme"
            >
              Encomendar uma peça
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left bg-ouro/60 transition-transform duration-500 group-hover:scale-x-0" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Guia em 3D */}
        <motion.div
          className="relative order-first h-[46svh] lg:order-0 lg:col-span-6 lg:h-[78svh]"
          style={{ y: descer3D, scale: encolher3D }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.4 }}
        >
          <Suspense fallback={null}>
            <Guia3D />
          </Suspense>
        </motion.div>
      </div>

      {/* Faixa de pilares no pé do hero */}
      <motion.div
        className="absolute inset-x-0 bottom-0 hidden border-t border-linha md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-linha px-6">
          {PILARES.map((p, i) => (
            <div key={p.titulo} className="flex items-baseline gap-4 py-5 pl-6 first:pl-0">
              <span className="font-elegante text-sm italic text-ouro">0{i + 1}</span>
              <p className="font-texto text-sm text-creme/80">
                {p.titulo}
                <span className="text-creme/40"> — {p.texto}</span>
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}