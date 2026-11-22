import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import TituloSecao from './TituloSecao'

const SUAVE = [0.22, 1, 0.36, 1]

const PILARES = [
  { titulo: 'Feito à mão', texto: 'Cada peça é produzida com cuidado, uma a uma, sem pressa e sem produção em série.' },
  { titulo: 'Com fé e respeito', texto: 'Cores, contas e firmas escolhidas com respeito aos fundamentos de cada linha.' },
  { titulo: 'Sob encomenda', texto: 'Você conta como imagina a sua peça e a gente cria junto com você.' },
]

// Ornamento que se desenha quando aparece na tela e gira de leve com a rolagem
const DESENHO = { oculto: { pathLength: 0, opacity: 0 }, visivel: { pathLength: 1, opacity: 1 } }

function Ornamento() {
  const caixa = useRef(null)
  const { scrollYProgress } = useScroll({ target: caixa, offset: ['start end', 'end start'] })
  const giro = useSpring(useTransform(scrollYProgress, [0, 1], [-25, 25]), { stiffness: 60, damping: 20 })

  const contas = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2
    return { x: 200 + 170 * Math.cos(a), y: 200 + 170 * Math.sin(a), i }
  })
  const traco = (atraso) => ({ duration: 2.2, ease: SUAVE, delay: atraso })

  return (
    <div ref={caixa} className="relative mx-auto aspect-square w-full max-w-md overflow-hidden">
      <motion.svg
        viewBox="0 0 400 400"
        className="h-full w-full"
        fill="none"
        style={{ rotate: giro }}
        initial="oculto"
        whileInView="visivel"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.circle cx="200" cy="200" r="170" stroke="#c4a06a" strokeOpacity="0.5" strokeWidth="0.75" variants={DESENHO} transition={traco(0)} />
        <motion.circle cx="200" cy="200" r="120" stroke="#e3cfa6" strokeOpacity="0.35" strokeWidth="0.75" variants={DESENHO} transition={traco(0.2)} />
        <motion.circle cx="200" cy="200" r="60" stroke="#c4a06a" strokeOpacity="0.5" strokeWidth="0.75" variants={DESENHO} transition={traco(0.4)} />
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.ellipse
            key={i}
            cx="200"
            cy="200"
            rx="120"
            ry="34"
            stroke="#c4a06a"
            strokeOpacity="0.4"
            strokeWidth="0.75"
            transform={`rotate(${i * 22.5} 200 200)`}
            variants={DESENHO}
            transition={traco(0.5 + i * 0.08)}
          />
        ))}
        {contas.map(({ x, y, i }) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i % 6 === 0 ? 6 : 3.5}
            fill={i % 6 === 0 ? '#e3cfa6' : '#c4a06a'}
            variants={{ oculto: { opacity: 0, scale: 0 }, visivel: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.5, ease: SUAVE, delay: 0.6 + i * 0.04 }}
          />
        ))}
        <circle cx="200" cy="200" r="5" fill="#e3cfa6" />
      </motion.svg>
    </div>
  )
}

export default function Sobre() {
  return (
    <section id="sobre" className="relative scroll-mt-20 border-t border-linha px-6 py-28 lg:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <TituloSecao numero="02" rotulo="O ateliê">
              Tradição que passa <em className="text-ouro-claro">de mão em mão</em>
            </TituloSecao>
            <div className="mt-12 hidden lg:block">
              <Ornamento />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-28">
          {/* TROQUE ESTES TEXTOS pelos da loja */}
          <motion.p
            className="font-elegante text-[clamp(1.6rem,2.6vw,2.25rem)] leading-[1.3] text-creme/90"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: SUAVE }}
          >
            O Ateliê da Cabocla nasceu do desejo de levar artigos religiosos feitos com fé, carinho e respeito à tradição para quem caminha com os orixás e as entidades.
          </motion.p>
          <motion.p
            className="mt-8 max-w-xl font-texto text-base leading-relaxed text-creme/60"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: SUAVE, delay: 0.1 }}
          >
            Aqui você encontra guias, brajás, pulseiras e peças personalizadas, produzidas para acompanhar a sua caminhada.
          </motion.p>

          <div className="mx-auto mt-16 max-w-xs lg:hidden">
            <Ornamento />
          </div>

          <ul className="mt-20">
            {PILARES.map((p, i) => (
              <motion.li
                key={p.titulo}
                className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-linha py-8 last:border-b sm:grid-cols-[4rem_14rem_1fr]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: SUAVE, delay: i * 0.1 }}
              >
                <span className="font-elegante text-lg italic text-ouro">0{i + 1}</span>
                <h3 className="font-elegante text-2xl text-creme transition-transform duration-500 group-hover:translate-x-1">{p.titulo}</h3>
                <p className="col-start-2 mt-2 font-texto text-sm leading-relaxed text-creme/55 sm:col-start-3 sm:mt-0">{p.texto}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}