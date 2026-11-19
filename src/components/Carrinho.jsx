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
          <motion.div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar} />

          {/* Painel */}
          <motion.aside className="fixed right-0 top-0 z-70 flex h-full w-full max-w-md flex-col border-l border-linha bg-noite shadow-2xl" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            {/* Cabeçalho */}
            <div className="flex items-center justify-between border-b border-linha px-6 py-5">
              <h2 className="font-elegante text-3xl font-medium text-creme">Sua sacola</h2>
              <motion.button onClick={onFechar} className="text-creme/70 hover:text-creme" whileHover={{ rotate: 90 }} whileTap={{ scale: 0.9 }} aria-label="Fechar carrinho">
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Lista */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {itens.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <MandalaIcone className="h-16 w-16 opacity-60" />
                  <p className="font-elegante text-2xl italic text-creme/70">Sua sacola está vazia</p>
                  <motion.button onClick={onFechar} className="font-texto text-xs font-semibold uppercase tracking-[0.2em] text-creme/70 underline decoration-ouro/60 underline-offset-[6px] hover:text-creme">
                    Continuar comprando
                  </motion.button>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence mode="popLayout">
                    {itens.map(({ produto, quantidade }) => (
                      <motion.li key={produto.id} layout initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, scale: 0.9 }} className="flex gap-4 border-b border-linha pb-4">
                        <div className="relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${produto.cores[0]}, ${produto.cores[1]})` }}>
                          {produto.imagem ? <img src={produto.imagem} alt={produto.nome} className="absolute inset-0 h-full w-full object-cover" /> : <MandalaIcone className="h-12 w-12" />}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-elegante text-xl font-medium leading-tight text-creme">{produto.nome}</p>
                              <p className="mt-0.5 font-texto text-[11px] uppercase tracking-[0.15em] text-creme/40">{produto.divisao}</p>
                            </div>
                            <button onClick={() => onRemover(produto.id)} className="text-creme/50 transition-colors hover:text-terracota" aria-label="Remover">
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 border border-linha px-2 py-1">
                              <motion.button onClick={() => onAlterar(produto.id, -1)} className="h-6 w-6 text-lg leading-none text-ouro-claro" whileTap={{ scale: 0.8 }}>
                                −
                              </motion.button>
                              <span className="w-4 text-center font-texto text-sm">{quantidade}</span>
                              <motion.button onClick={() => onAlterar(produto.id, 1)} className="h-6 w-6 text-lg leading-none text-ouro-claro" whileTap={{ scale: 0.8 }}>
                                +
                              </motion.button>
                            </div>
                            <p className="font-texto text-sm font-medium text-ouro-claro">{formatarPreco(produto.preco * quantidade)}</p>
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
              <div className="border-t border-linha px-6 py-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-texto text-sm text-creme/70">Total</span>
                  <motion.span key={total} className="font-elegante text-3xl text-creme" initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                    {formatarPreco(total)}
                  </motion.span>
                </div>

                <motion.button onClick={finalizar} className="w-full rounded-sm bg-creme py-4 font-texto text-xs font-semibold uppercase tracking-[0.2em] text-noite transition-colors hover:bg-ouro-claro" whileTap={{ scale: 0.98 }}>
                  Finalizar compra
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}