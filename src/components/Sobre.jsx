import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { HandHeart, Flame, Sparkles, Feather } from 'lucide-react'

const PILARES = [
  { Icone: HandHeart, titulo: 'Feito à mão', texto: 'Cada peça é produzida com cuidado, uma a uma.' },
  { Icone: Flame, titulo: 'Com fé e respeito', texto: 'Tradição e respeito em cada detalhe.' },
  { Icone: Sparkles, titulo: 'Sob encomenda', texto: 'Personalizamos a peça do seu jeito.' },
]

const ORBITA = Array(6).fill(Feather)

function Orbita() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      {/* Anéis decorativos */}
      <div className="absolute inset-0 rounded-full border border-dashed border-ouro/40" />
      <div className="absolute inset-[18%] rounded-full border border-ouro/20" />

      {/* Brilho central */}
      <motion.div className="absolute inset-[30%] rounded-full bg-ouro/20 blur-2xl" animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />

      {/* Mandala central */}
      <motion.div className="absolute inset-0 flex items-center justify-center" animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
        <svg viewBox="0 0 200 200" className="h-32 w-32" fill="none">
          <circle cx="100" cy="100" r="92" stroke="#d4a24c" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="100" cy="100" r="70" stroke="#f0d28a" strokeWidth="0.8" />
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="100" cy="100" rx="70" ry="20" stroke="#d4a24c" strokeWidth="0.8" transform={`rotate(${i * 22.5} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="6" fill="#f0d28a" />
        </svg>
      </motion.div>

      {/* Ícones girando em volta */}
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
        {ORBITA.map((Icone, i) => {
          const angulo = (i / ORBITA.length) * Math.PI * 2
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + 50 * Math.cos(angulo)}%`, top: `${50 + 50 * Math.sin(angulo)}%` }}>
              <motion.div className="flex h-14 w-14 items-center justify-center rounded-full border border-ouro/40 bg-noite/80 text-ouro-claro shadow-lg shadow-ouro/10" animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
                <Icone className="h-7 w-7" strokeWidth={1.5} />
              </motion.div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

function Pilar({ Icone, titulo, texto, indice }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })

  function mover(e) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function sair() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div onMouseMove={mover} onMouseLeave={sair} style={{ rotateX, rotateY, transformPerspective: 1000 }} className="rounded-2xl border border-ouro/20 bg-musgo/40 p-8 text-center backdrop-blur" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: indice * 0.15, duration: 0.7 }} whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(143,181,138,0.2)' }}>
      <motion.div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-ouro/40 bg-noite/60 text-ouro-claro" animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + indice, repeat: Infinity, ease: 'easeInOut' }}>
        <Icone className="h-9 w-9" strokeWidth={1.4} />
      </motion.div>
      <h3 className="mt-5 font-titulo text-lg text-ouro-claro">{titulo}</h3>
      <p className="mt-2 font-texto text-sm text-creme/70">{texto}</p>
    </motion.div>
  )
}

export default function Sobre() {
  return (
    <section id="sobre" className="relative scroll-mt-20 overflow-hidden px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9 }}>
          <p className="font-elegante text-lg italic tracking-[0.3em] text-ouro-claro">nossa história</p>
          <h2 className="mt-2 bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-4xl font-bold text-transparent sm:text-5xl">Sobre o Ateliê</h2>
          <div className="mt-4 h-px w-28 bg-ouro" />

          {/* TROQUE ESTES TEXTOS pelos da loja */}
          <p className="mt-6 font-elegante text-xl leading-relaxed text-creme/85">
            O Ateliê da Cabocla nasceu do desejo de levar artigos religiosos feitos com fé, carinho e respeito à tradição para quem caminha com os orixás e as entidades.
          </p>
          <p className="mt-4 font-elegante text-xl leading-relaxed text-creme/85">
            Aqui você encontra guias, brajás, pulseiras e peças personalizadas, produzidas para acompanhar a sua caminhada.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1 }}>
          <Orbita />
        </motion.div>
      </div>

      {/* Pilares */}
      <div className="mx-auto mt-20 grid max-w-7xl gap-6 sm:grid-cols-3">
        {PILARES.map((pilar, i) => (
          <Pilar key={pilar.titulo} {...pilar} indice={i} />
        ))}
      </div>
    </section>
  )
}