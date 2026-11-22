import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import MandalaIcone from './MandalaIcone'

const SUAVE = [0.22, 1, 0.36, 1]
const MOLA = { stiffness: 140, damping: 18 }

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CardProduto({ produto, onAdicionar, indice = 0, grande = false, selo, className = '' }) {
  const [adicionado, setAdicionado] = useState(false)

  // Inclinação 3D leve, com a foto andando no sentido contrário (profundidade)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), MOLA)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), MOLA)
  const fotoX = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), MOLA)
  const fotoY = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), MOLA)

  function mover(e) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function sair() {
    mx.set(0)
    my.set(0)
  }

  function adicionar() {
    onAdicionar(produto)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 1600)
  }

  const [cor1, cor2] = produto.cores?.length ? produto.cores : ['#1f2b22', '#121a15']

  return (
    <motion.article
      className={`group flex flex-col ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, ease: SUAVE, delay: (indice % 4) * 0.08 }}
    >
      <div className="flex-1 perspective-distant">
        <motion.div
          onPointerMove={mover}
          onPointerLeave={sair}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className={`relative h-full overflow-hidden bg-musgo ${grande ? 'aspect-4/5 lg:aspect-auto lg:min-h-full' : 'aspect-4/5'}`}
        >
          {/* Cortina que se abre quando o card aparece */}
          <motion.div
            className="absolute inset-0 z-20 origin-top bg-noite"
            initial={{ scaleY: 1 }}
            whileInView={{ scaleY: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, ease: SUAVE, delay: 0.1 + (indice % 4) * 0.08 }}
          />

          <motion.div className="absolute -inset-4" style={{ x: fotoX, y: fotoY }}>
            {produto.imagem ? (
              <img
                src={produto.imagem}
                alt={produto.nome}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-suave group-hover:scale-[1.06]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center" style={{ background: `radial-gradient(circle at 50% 40%, ${cor1}, ${cor2})` }}>
                <MandalaIcone className={`opacity-80 transition-transform duration-[1.4s] ease-out group-hover:rotate-90 ${grande ? 'h-32 w-32' : 'h-20 w-20'}`} />
              </div>
            )}
          </motion.div>

          {/* Escurece a base para o botão ficar legível */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent" />

          {selo && (
            <span className="absolute left-4 top-4 z-10 bg-creme px-2.5 py-1 font-texto text-[10px] font-semibold uppercase tracking-[0.18em] text-noite">
              {selo}
            </span>
          )}

          {/* Botão rápido: sobe no hover (no celular fica sempre visível) */}
          <button
            onClick={adicionar}
            className={`absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2 py-3 font-texto sm:py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all duration-500 ease-suave [@media(hover:hover)]:translate-y-[130%] [@media(hover:hover)]:group-hover:translate-y-0 ${
              adicionado ? 'bg-ouro text-noite' : 'bg-creme text-noite hover:bg-ouro-claro'
            }`}
          >
            {adicionado ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adicionado ? 'Adicionado' : <>Adicionar<span className="hidden sm:inline">&nbsp;à sacola</span></>}
          </button>
        </motion.div>
      </div>

      <div className="mt-4 flex flex-col gap-1 sm:mt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="truncate font-texto text-[11px] uppercase tracking-[0.18em] text-creme/45">
            {[produto.tipo, produto.divisao || produto.linha].filter(Boolean).join(' · ')}
          </p>
          <h3 className={`mt-1.5 font-elegante font-medium leading-tight text-creme ${grande ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-xl sm:text-2xl'}`}>
            {produto.nome}
          </h3>
        </div>
        <p className={`shrink-0 font-texto sm:pt-5 font-medium text-ouro-claro ${grande ? 'text-lg' : 'text-base'}`}>
          {formatarPreco(produto.preco)}
        </p>
      </div>
    </motion.article>
  )
}