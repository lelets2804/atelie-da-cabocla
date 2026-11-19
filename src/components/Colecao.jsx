import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUTOS, TIPOS, LINHAS } from '../data/produtos'
import CardProduto from './CardProduto'

const SUAVE = [0.22, 1, 0.36, 1]

// Abas com sublinhado que desliza até a opção escolhida
function Abas({ opcoes, ativo, onChange, layoutId }) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-8">
        {opcoes.map((opcao) => (
          <button
            key={opcao}
            onClick={() => onChange(opcao)}
            className={`relative pb-3 font-texto text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
              ativo === opcao ? 'text-creme' : 'text-creme/45 hover:text-creme/80'
            }`}
          >
            {opcao}
            {ativo === opcao && (
              <motion.span layoutId={layoutId} className="absolute inset-x-0 bottom-0 h-px bg-ouro" transition={{ duration: 0.45, ease: SUAVE }} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Botões pequenos (linha e orixá/entidade)
function Chips({ rotulo, opcoes, ativo, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 font-texto text-[11px] uppercase tracking-[0.2em] text-creme/35">{rotulo}</span>
      {opcoes.map((opcao) => (
        <button
          key={opcao}
          onClick={() => onChange(opcao)}
          className={`rounded-full border px-4 py-1.5 font-texto text-xs transition-colors duration-300 ${
            ativo === opcao ? 'border-creme bg-creme text-noite' : 'border-creme/15 text-creme/70 hover:border-creme/40 hover:text-creme'
          }`}
        >
          {opcao}
        </button>
      ))}
    </div>
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

  const produtosFiltrados = PRODUTOS.filter(
    (p) => (tipo === 'Todos' || p.tipo === tipo) && (linha === 'Todas' || p.linha === linha) && (divisao === 'Todas' || p.divisao === divisao)
  )

  const nomeDivisao = linha === 'Orixás' ? 'Orixá' : 'Entidade'

  return (
    <section id="colecao" className="relative mx-auto max-w-7xl scroll-mt-20 px-6 pb-32 pt-20">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-6 border-b border-linha pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <motion.p
            className="font-texto text-[11px] font-medium uppercase tracking-[0.32em] text-ouro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Catálogo
          </motion.p>
          <div className="mt-4 overflow-hidden pb-[0.1em]">
            <motion.h1
              className="font-elegante text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.02em] text-creme"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: SUAVE }}
            >
              Nossa <em className="text-ouro-claro">coleção</em>
            </motion.h1>
          </div>
        </div>
        <p className="font-texto text-sm text-creme/45">
          <motion.span key={produtosFiltrados.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-creme">
            {produtosFiltrados.length}
          </motion.span>{' '}
          {produtosFiltrados.length === 1 ? 'peça' : 'peças'}
        </p>
      </div>

      {/* Filtros */}
      <div className="sticky top-14.25 z-30 -mx-6 mb-14 border-b border-linha bg-noite/90 px-6 pt-6 backdrop-blur-md">
        <Abas opcoes={['Todos', ...TIPOS]} ativo={tipo} onChange={setTipo} layoutId="tipo-ativo" />
      </div>

      <div className="-mt-6 mb-14 flex flex-col gap-4">
        <Chips rotulo="Linha" opcoes={['Todas', ...Object.keys(LINHAS)]} ativo={linha} onChange={mudarLinha} />
        <AnimatePresence mode="wait">
          {linha !== 'Todas' && (
            <motion.div
              key={linha}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: SUAVE }}
              className="overflow-hidden"
            >
              <Chips rotulo={nomeDivisao} opcoes={['Todas', ...LINHAS[linha]]} ativo={divisao} onChange={setDivisao} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Produtos */}
      <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {produtosFiltrados.map((produto, i) => (
            <motion.div
              key={produto.id}
              layout
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: SUAVE }}
            >
              <CardProduto produto={produto} indice={i} onAdicionar={onAdicionar} selo={produto.destaque ? 'Destaque' : undefined} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {produtosFiltrados.length === 0 && (
        <motion.p className="py-20 text-center font-elegante text-3xl italic text-creme/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Ainda não temos peças nesta seleção. Em breve, teremos.
        </motion.p>
      )}
    </section>
  )
}