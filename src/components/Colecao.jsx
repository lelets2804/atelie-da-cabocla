import { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { PRODUTOS, TIPOS, LINHAS } from '../data/produtos'
import ArteProduto from './ArteProduto'

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Linha de botões de filtro, com a bolinha dourada deslizando
function Filtros({ opcoes, ativo, onChange, layoutId, pequeno = false }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {opcoes.map((opcao) => (
        <button key={opcao} onClick={() => onChange(opcao)} className={`relative rounded-full font-texto tracking-wide text-creme ${pequeno ? 'px-4 py-1.5 text-xs' : 'px-6 py-2 text-sm'}`}>
          {ativo === opcao && (
            <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full bg-gradient-to-r from-ouro to-ouro-claro" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
          )}
          <span className={`relative z-10 ${ativo === opcao ? 'font-medium text-noite' : ''}`}>{opcao}</span>
        </button>
      ))}
    </div>
  )
}

function ProdutoCard({ produto, onAdicionar }) {
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
    <motion.article layout onMouseMove={mover} onMouseLeave={sair} style={{ rotateX, rotateY, transformPerspective: 1000 }} initial={{ opacity: 0, y: 50, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.6, type: 'spring' }} whileHover={{ y: -10, boxShadow: '0 20px 50px rgba(143,181,138,0.25)' }} className="group overflow-hidden rounded-2xl border border-ouro/20 bg-musgo/40 backdrop-blur">
      <div className="relative flex h-56 items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${produto.cores[0]}, ${produto.cores[1]})` }}>
        <ArteProduto produto={produto} tamanho="text-7xl" />

        <span className="absolute left-3 top-3 rounded-full bg-noite/70 px-3 py-1 font-texto text-xs text-ouro-claro backdrop-blur">{produto.divisao}</span>

        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>

      <div className="p-5">
        <p className="font-texto text-xs uppercase tracking-widest text-ouro/80">{produto.tipo} · {produto.linha}</p>
        <h3 className="mt-1 font-elegante text-2xl font-semibold text-creme">{produto.nome}</h3>
        <p className="mt-2 font-titulo text-xl text-ouro-claro">{formatarPreco(produto.preco)}</p>

        <motion.button onClick={adicionar} className="mt-4 w-full rounded-full border border-ouro px-4 py-3 font-titulo text-xs tracking-widest text-ouro-claro" animate={{ backgroundColor: adicionado ? 'rgba(212,162,76,0.9)' : 'rgba(212,162,76,0.05)', color: adicionado ? '#16241a' : '#f0d28a' }} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
          {adicionado ? 'ADICIONADO ✓' : 'ADICIONAR AO CARRINHO'}
        </motion.button>
      </div>
    </motion.article>
  )
}

export default function Colecao({ onAdicionar }) {
  const [tipo, setTipo] = useState('Todos')
  const [linha, setLinha] = useState('Todas')
  const [divisao, setDivisao] = useState('Todas')

  function mudarLinha(nova) {
    setLinha(nova)
    setDivisao('Todas')
  }

  const produtosFiltrados = PRODUTOS.filter((p) => (tipo === 'Todos' || p.tipo === tipo) && (linha === 'Todas' || p.linha === linha) && (divisao === 'Todas' || p.divisao === divisao))

  return (
    <section id="colecao" className="relative mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
      <div className="mb-12 text-center">
        <motion.h2 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-4xl font-bold text-transparent sm:text-5xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          Nossa Coleção
        </motion.h2>
        <motion.div className="mx-auto mt-4 h-px bg-ouro" initial={{ width: 0 }} whileInView={{ width: 120 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
      </div>

      {/* Filtros */}
      <div className="mb-12 flex flex-col items-center gap-5">
        <Filtros opcoes={['Todos', ...TIPOS]} ativo={tipo} onChange={setTipo} layoutId="tipo-ativo" />

        <Filtros opcoes={['Todas', ...Object.keys(LINHAS)]} ativo={linha} onChange={mudarLinha} layoutId="linha-ativa" />

        <AnimatePresence mode="wait">
          {linha !== 'Todas' && (
            <motion.div key={linha} initial={{ opacity: 0, height: 0, y: -10 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <Filtros opcoes={['Todas', ...LINHAS[linha]]} ativo={divisao} onChange={setDivisao} layoutId="divisao-ativa" pequeno />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Produtos */}
      <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {produtosFiltrados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} onAdicionar={onAdicionar} />
          ))}
        </AnimatePresence>
      </motion.div>

      {produtosFiltrados.length === 0 && (
        <motion.p className="py-16 text-center font-elegante text-2xl italic text-creme/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Ainda não temos peças nesta seleção. Em breve, com fé, teremos! ✦
        </motion.p>
      )}
    </section>
  )
}