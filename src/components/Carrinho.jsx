import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import MandalaIcone from './MandalaIcone'

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Carrinho({ aberto, onFechar, itens, onAlterar, onRemover }) {
  const navigate = useNavigate()

  const total = itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0)

  // Trava a rolagem da página enquanto o carrinho está aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [aberto])

  function finalizar() {
    onFechar()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {aberto && (
        <>
          {/* Fundo escuro */}
          <motion.div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />

          {/* Painel */}
          <motion.aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-ouro/30 bg-noite shadow-2xl" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-ouro/20 px-6 py-5">
              <h2 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-xl font-bold text-transparent">Seu Carrinho</h2>
              <motion.button onClick={onFechar} className="text-ouro-claro" whileHover={{ rotate: 90, scale: 1.2 }} whileTap={{ scale: 0.9 }} aria-label="Fechar carrinho">
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {itens.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <motion.span animate={{ y: [0, -14, 0], rotate: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                    <MandalaIcone className="h-20 w-20" />
                  </motion.span>
                  <p className="font-elegante text-2xl italic text-creme/70">Seu carrinho está vazio</p>
                  <motion.button onClick={onFechar} className="rounded-full border border-ouro px-6 py-2 font-titulo text-xs tracking-widest text-ouro-claro" whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }} whileTap={{ scale: 0.95 }}>
                    VER COLEÇÃO
                  </motion.button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {itens.map(({ produto, quantidade }) => (
                      <motion.li key={produto.id} layout initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} className="flex gap-4 rounded-xl border border-ouro/15 bg-musgo/40 p-3">
                        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg" style={{ background: `linear-gradient(135deg, ${produto.cores[0]}, ${produto.cores[1]})` }}>
                          {produto.imagem ? <img src={produto.imagem} alt={produto.nome} className="absolute inset-0 h-full w-full object-cover" /> : <MandalaIcone className="h-12 w-12" />}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-elegante text-lg font-semibold leading-tight text-creme">{produto.nome}</p>
                              <p className="font-texto text-xs text-ouro/80">{produto.divisao}</p>
                            </div>
                            <button onClick={() => onRemover(produto.id)} className="text-creme/50 transition-colors hover:text-terracota" aria-label="Remover">
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 rounded-full border border-ouro/40 px-2 py-1">
                              <motion.button onClick={() => onAlterar(produto.id, -1)} className="h-6 w-6 text-lg leading-none text-ouro-claro" whileTap={{ scale: 0.8 }}>
                                −
                              </motion.button>
                              <span className="w-4 text-center font-texto text-sm">{quantidade}</span>
                              <motion.button onClick={() => onAlterar(produto.id, 1)} className="h-6 w-6 text-lg leading-none text-ouro-claro" whileTap={{ scale: 0.8 }}>
                                +
                              </motion.button>
                            </div>
                            <p className="font-titulo text-sm text-ouro-claro">{formatarPreco(produto.preco * quantidade)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Rodapé com total */}
            {itens.length > 0 && (
              <div className="border-t border-ouro/20 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-texto text-sm text-creme/70">Total</span>
                  <motion.span key={total} className="font-titulo text-2xl text-ouro-claro" initial={{ scale: 1.3 }} animate={{ scale: 1 }}>
                    {formatarPreco(total)}
                  </motion.span>
                </div>

                <motion.button onClick={finalizar} className="w-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite" whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,162,76,0.6)' }} whileTap={{ scale: 0.97 }}>
                  FINALIZAR COMPRA
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}