import { useMemo } from 'react'
import { motion } from 'framer-motion'

const NOME = 'Ateliê da Cabocla'

function Estrelas({ quantidade = 45 }) {
  const estrelas = useMemo(
    () =>
      Array.from({ length: quantidade }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        tamanho: 2 + Math.random() * 4,
        duracao: 3 + Math.random() * 5,
        atraso: Math.random() * 5,
      })),
    [quantidade]
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      {estrelas.map((e) => (
        <motion.span
          key={e.id}
          className="absolute rounded-full bg-ouro-claro"
          style={{
            left: `${e.left}%`,
            top: `${e.top}%`,
            width: e.tamanho,
            height: e.tamanho,
          }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [1, 1.6, 1], y: [0, -20, 0] }}
          transition={{
            duration: e.duracao,
            delay: e.atraso,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function Mandala({ duracao, reverso = false, opacidade = 0.3, escala = 1 }) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="pointer-events-none absolute h-[140vw] w-[140vw] max-h-255 max-w-255"
      style={{ opacity: opacidade, scale: escala }}
      animate={{ rotate: reverso ? -360 : 360 }}
      transition={{ duration: duracao, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="200" cy="200" r="190" fill="none" stroke="#d4a24c" strokeWidth="1" strokeDasharray="4 10" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="#f0d28a" strokeWidth="0.8" />
      {Array.from({ length: 12 }).map((_, i) => (
        <ellipse
          key={i}
          cx="200"
          cy="200"
          rx="150"
          ry="40"
          fill="none"
          stroke="#d4a24c"
          strokeWidth="0.6"
          transform={`rotate(${i * 30} 200 200)`}
        />
      ))}
    </motion.svg>
  )
}

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-ameixa),var(--color-noite)_70%)] px-6">
      {/* Brilhos coloridos ao fundo */}
      <motion.div
        className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-roxo/40 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-ouro/20 blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Estrelas />

      {/* Mandalas girando em sentidos opostos */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Mandala duracao={90} opacidade={0.3} />
        <Mandala duracao={60} reverso opacidade={0.2} escala={0.7} />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center">
        <motion.p
          className="mb-4 font-elegante text-lg italic tracking-[0.3em] text-ouro-claro sm:text-2xl"
          initial={{ opacity: 0, letterSpacing: '1em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.5 }}
        >
          artigos religiosos
        </motion.p>

        <h1 className="font-titulo text-4xl font-bold sm:text-6xl lg:text-8xl">
          {NOME.split('').map((letra, i) => (
            <motion.span
              key={i}
              className="inline-block bg-linear-to-b from-ouro-claro to-ouro bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 60, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.8, type: 'spring' }}
            >
              {letra === ' ' ? '\u00A0' : letra}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-6 max-w-xl font-elegante text-xl text-creme/80 sm:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          Peças feitas com fé, cuidado e axé para acompanhar a sua caminhada.
        </motion.p>

        <motion.a
          href="#colecao"
          className="mt-10 inline-block rounded-full border border-ouro bg-ouro/10 px-10 py-4 font-titulo text-sm tracking-widest text-ouro-claro backdrop-blur"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          whileHover={{
            scale: 1.08,
            backgroundColor: 'rgba(212,162,76,0.3)',
            boxShadow: '0 0 40px rgba(212,162,76,0.6)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          VER COLEÇÃO
        </motion.a>
      </div>

      {/* Indicador de rolagem */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-3xl text-ouro"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        ⌄
      </motion.div>
    </section>
  )
}