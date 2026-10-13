import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { PRODUTOS } from '../data/produtos'
import ArteProduto from './ArteProduto'

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function CardDestaque({ produto, indice, grande, onAdicionar }) {
  const [adicionado, setAdicionado] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 150, damping: 15 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })

  function adicionar() {
    onAdicionar(produto)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 1500)
  }

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
    <motion.article onMouseMove={mover} onMouseLeave={sair} style={{ rotateX, rotateY, transformPerspective: 1000 }} className={`group relative flex h-full min-w-[78%] snap-center flex-col overflow-hidden rounded-3xl border border-ouro/25 bg-musgo/40 backdrop-blur sm:min-w-[46%] lg:min-w-0 ${grande ? 'lg:col-span-2 lg:row-span-2' : ''}`} initial={{ opacity: 0, y: 60, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: indice * 0.12, duration: 0.7, type: 'spring' }} whileHover={{ y: -10, boxShadow: '0 25px 60px rgba(143,181,138,0.3)' }}>
      {/* Área da imagem */}
      <div className={`relative flex flex-1 items-center justify-center overflow-hidden ${grande ? 'min-h-72' : 'min-h-44'}`} style={{ background: `linear-gradient(135deg, ${produto.cores[0]}, ${produto.cores[1]})` }}>
        {/* Anel girando atrás do símbolo (só quando não há foto) */}
        {!produto.imagem && (
          <motion.div className={`absolute rounded-full border border-dashed border-white/30 ${grande ? 'h-64 w-64' : 'h-36 w-36'}`} animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} />
        )}

        <ArteProduto produto={produto} tamanho={grande ? 'text-9xl' : 'text-6xl'} />

        {/* Selo de destaque */}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-noite/70 px-3 py-1 font-texto text-xs text-ouro-claro backdrop-blur">
          <Star className="h-3 w-3 fill-ouro text-ouro" />
          Destaque
        </span>

        {/* Brilho que passa no hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>

      {/* Informações */}
      <div className={grande ? 'p-7' : 'p-5'}>
        <p className="font-texto text-xs uppercase tracking-widest text-ouro/80">{produto.tipo} · {produto.divisao}</p>
        <h3 className={`mt-1 font-elegante font-semibold text-creme ${grande ? 'text-4xl' : 'text-2xl'}`}>{produto.nome}</h3>
        <p className={`mt-2 font-titulo text-ouro-claro ${grande ? 'text-2xl' : 'text-xl'}`}>{formatarPreco(produto.preco)}</p>

        <motion.button onClick={adicionar} className="mt-4 w-full rounded-full border border-ouro px-4 py-3 font-titulo text-xs tracking-widest" animate={{ backgroundColor: adicionado ? 'rgba(212,162,76,0.9)' : 'rgba(212,162,76,0.05)', color: adicionado ? '#16241a' : '#f0d28a' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
          {adicionado ? 'ADICIONADO ✓' : 'ADICIONAR AO CARRINHO'}
        </motion.button>
      </div>
    </motion.article>
  )
}

export default function Destaques({ onAdicionar }) {
  const destaques = PRODUTOS.filter((p) => p.destaque).slice(0, 5)

  return (
    <section id="colecao" className="relative scroll-mt-20 overflow-hidden px-6 py-24">
      {/* Brilhos ao fundo */}
      <motion.div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-verde-claro/20 blur-3xl" animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-ouro/15 blur-3xl" animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="relative mx-auto max-w-7xl">
        {/* Título */}
        <div className="mb-14 text-center">
          <motion.p className="font-elegante text-lg italic tracking-[0.3em] text-ouro-claro" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            peças escolhidas com carinho
          </motion.p>
          <motion.h2 className="mt-2 bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-4xl font-bold text-transparent sm:text-5xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            Destaques
          </motion.h2>
          <motion.div className="mx-auto mt-4 h-px bg-ouro" initial={{ width: 0 }} whileInView={{ width: 120 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
        </div>

        {/* Mosaico (computador) / carrossel (celular) */}
        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {destaques.map((produto, i) => (
            <CardDestaque key={produto.id} produto={produto} indice={i} grande={i === 0} onAdicionar={onAdicionar} />
          ))}
        </div>

        <p className="mt-2 text-center font-texto text-xs text-creme/50 lg:hidden">Deslize para o lado para ver mais</p>

        {/* Botão para a página de produtos */}
        <div className="mt-14 text-center">
          <Link to="/produtos">
            <motion.span className="inline-flex items-center gap-3 rounded-full border border-ouro bg-ouro/10 px-10 py-4 font-titulo text-sm tracking-widest text-ouro-claro" whileHover={{ scale: 1.06, backgroundColor: 'rgba(212,162,76,0.3)', boxShadow: '0 0 40px rgba(212,162,76,0.5)' }} whileTap={{ scale: 0.95 }}>
              VER TODOS OS PRODUTOS
              <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.span>
          </Link>
        </div>
      </div>
    </section>
  )
}