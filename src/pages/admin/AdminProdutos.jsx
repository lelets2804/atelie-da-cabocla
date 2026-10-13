import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Star, Pencil, Trash2, X, PackageOpen, ImagePlus } from 'lucide-react'
import { PRODUTOS, TIPOS, LINHAS } from '../../data/produtos'
import { salvarProduto, excluirProduto, alternarDestaque } from '../../services/catalogo'
import { reduzirImagem } from '../../utils/imagem'
import MandalaIcone from '../../components/MandalaIcone'

const VAZIO = {
  nome: '',
  tipo: '',
  linha: '',
  divisao: '',
  preco: '',
  cores: ['#4f7a4a', '#16241a'],
  imagem: '',
  destaque: false,
}

const campo = 'w-full rounded-xl border border-ouro/30 bg-noite/70 px-4 py-3 font-texto text-sm text-creme placeholder:text-creme/40 outline-none transition focus:border-ouro focus:shadow-[0_0_20px_rgba(212,162,76,0.25)] [&>option]:bg-noite'

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function normalizar(texto) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function Campo({ rotulo, children }) {
  return (
    <label className="block text-left">
      <span className="mb-2 block font-texto text-xs uppercase tracking-widest text-ouro/80">{rotulo}</span>
      {children}
    </label>
  )
}

function Janela({ onFechar, children }) {
  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFechar}>
      <motion.div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-ouro/30 bg-noite p-6 shadow-2xl sm:p-8" initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }} onClick={(e) => e.stopPropagation()}>
        {children}
      </motion.div>
    </motion.div>
  )
}

function FormularioProduto({ produto, onSalvar, onFechar }) {
  const refArquivo = useRef(null)
  const [d, setD] = useState(() => (produto ? { ...VAZIO, ...produto, preco: String(produto.preco).replace('.', ',') } : VAZIO))
  const [erro, setErro] = useState('')
  const [lendo, setLendo] = useState(false)

  function mudar(nome, valor) {
    setD((atual) => ({
      ...atual,
      [nome]: valor,
      ...(nome === 'linha' ? { divisao: '' } : {}),
    }))
  }

  function mudarCor(indice, valor) {
    setD((atual) => {
      const cores = [...atual.cores]
      cores[indice] = valor
      return { ...atual, cores }
    })
  }

  async function aoEscolherFoto(e) {
    const arquivo = e.target.files?.[0]
    e.target.value = ''
    if (!arquivo) return

    setErro('')
    setLendo(true)
    try {
      const imagem = await reduzirImagem(arquivo)
      mudar('imagem', imagem)
    } catch (err) {
      setErro(err.message)
    } finally {
      setLendo(false)
    }
  }

  function aoEnviar(e) {
    e.preventDefault()
    setErro('')
    const preco = Number(String(d.preco).replace(',', '.'))

    if (!d.nome.trim() || !d.tipo || !d.linha || !d.divisao) {
      return setErro('Preencha o nome, o tipo, a linha e a divisão.')
    }
    if (!(preco > 0)) return setErro('Digite um preço válido.')

    const falha = onSalvar({ ...d, nome: d.nome.trim(), preco: Math.round(preco * 100) / 100 })
    if (falha) setErro(falha)
  }

  return (
    <form onSubmit={aoEnviar}>
      <div className="flex items-start justify-between">
        <h2 className="font-titulo text-xl text-ouro-claro">{produto ? 'Editar produto' : 'Novo produto'}</h2>
        <button type="button" onClick={onFechar} className="text-creme/60 hover:text-creme" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Prévia */}
      <div className="relative mt-5 flex h-48 items-center justify-center overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${d.cores[0]}, ${d.cores[1]})` }}>
        {d.imagem ? (
          <img src={d.imagem} alt="Prévia" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <MandalaIcone className="h-24 w-24" />
          </motion.span>
        )}
      </div>

      {/* Foto */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input ref={refArquivo} type="file" accept="image/*" className="hidden" onChange={aoEscolherFoto} />
        <motion.button type="button" onClick={() => refArquivo.current?.click()} disabled={lendo} className="flex items-center gap-2 rounded-full border border-ouro px-5 py-2 font-titulo text-xs tracking-widest text-ouro-claro disabled:opacity-60" whileHover={{ scale: 1.04, backgroundColor: 'rgba(212,162,76,0.2)' }} whileTap={{ scale: 0.95 }}>
          <ImagePlus className="h-4 w-4" />
          {lendo ? 'LENDO FOTO...' : d.imagem ? 'TROCAR FOTO' : 'ESCOLHER FOTO'}
        </motion.button>

        {d.imagem && (
          <button type="button" onClick={() => mudar('imagem', '')} className="font-texto text-xs text-creme/60 underline-offset-4 hover:text-terracota hover:underline">
            Remover foto
          </button>
        )}
      </div>
      <p className="mt-2 font-texto text-xs text-creme/50">A foto é reduzida automaticamente. Fotos quadradas ou um pouco horizontais, bem iluminadas, ficam melhores.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo rotulo="Nome do produto">
            <input className={campo} value={d.nome} onChange={(e) => mudar('nome', e.target.value)} placeholder="Ex.: Guia de Iemanjá" />
          </Campo>
        </div>

        <Campo rotulo="Tipo">
          <select className={campo} value={d.tipo} onChange={(e) => mudar('tipo', e.target.value)}>
            <option value="">Escolha...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Campo>

        <Campo rotulo="Preço (R$)">
          <input className={campo} value={d.preco} onChange={(e) => mudar('preco', e.target.value)} placeholder="89,90" inputMode="decimal" />
        </Campo>

        <Campo rotulo="Linha">
          <select className={campo} value={d.linha} onChange={(e) => mudar('linha', e.target.value)}>
            <option value="">Escolha...</option>
            {Object.keys(LINHAS).map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </Campo>

        <Campo rotulo={d.linha === 'Entidades' ? 'Entidade' : d.linha === 'Orixás' ? 'Orixá' : 'Divisão'}>
          <select className={campo} value={d.divisao} onChange={(e) => mudar('divisao', e.target.value)} disabled={!d.linha}>
            <option value="">Escolha...</option>
            {(LINHAS[d.linha] || []).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </Campo>

        <div className="sm:col-span-2">
          <Campo rotulo="Cores do fundo (se não tiver foto)">
            <div className="flex gap-3">
              {[0, 1].map((i) => (
                <input key={i} type="color" value={d.cores[i]} onChange={(e) => mudarCor(i, e.target.value)} className="h-12 w-full cursor-pointer rounded-xl border border-ouro/30 bg-noite/70 p-1" />
              ))}
            </div>
          </Campo>
        </div>

        <label className="flex items-center gap-3 sm:col-span-2">
          <input type="checkbox" checked={d.destaque} onChange={(e) => mudar('destaque', e.target.checked)} className="h-5 w-5 accent-[#d4a24c]" />
          <span className="font-texto text-sm text-creme/85">Mostrar nos destaques da página inicial</span>
        </label>
      </div>

      {erro && <p className="mt-4 font-texto text-sm text-terracota">{erro}</p>}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <motion.button type="button" onClick={onFechar} className="rounded-full border border-ouro/40 px-6 py-3 font-titulo text-xs tracking-widest text-creme/80" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
          CANCELAR
        </motion.button>
        <motion.button type="submit" disabled={lendo} className="rounded-full bg-gradient-to-r from-ouro to-ouro-claro px-8 py-3 font-titulo text-xs font-bold tracking-widest text-noite disabled:opacity-60" whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(212,162,76,0.5)' }} whileTap={{ scale: 0.95 }}>
          SALVAR PRODUTO
        </motion.button>
      </div>
    </form>
  )
}

export default function AdminProdutos() {
  const [lista, setLista] = useState(() => [...PRODUTOS])
  const [busca, setBusca] = useState('')
  const [janela, setJanela] = useState(null) // { tipo: 'form' | 'excluir', produto }

  function atualizar() {
    setLista([...PRODUTOS])
  }

  // Devolve uma mensagem de erro, ou null se deu certo
  function aoSalvar(dados) {
    const resultado = salvarProduto(dados)
    if (!resultado.ok) return resultado.erro
    atualizar()
    setJanela(null)
    return null
  }

  function aoExcluir() {
    excluirProduto(janela.produto.id)
    atualizar()
    setJanela(null)
  }

  function aoAlternarDestaque(id) {
    alternarDestaque(id)
    atualizar()
  }

  const termo = normalizar(busca)
  const visiveis = lista.filter((p) => normalizar(`${p.nome} ${p.tipo} ${p.linha} ${p.divisao}`).includes(termo))
  const totalDestaques = lista.filter((p) => p.destaque).length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent">Produtos</h1>
          <div className="mt-2 h-px w-24 bg-ouro" />
        </div>

        <motion.button onClick={() => setJanela({ tipo: 'form', produto: null })} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-ouro to-ouro-claro px-6 py-3 font-titulo text-xs font-bold tracking-widest text-noite" whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,162,76,0.5)' }} whileTap={{ scale: 0.95 }}>
          <Plus className="h-4 w-4" />
          NOVO PRODUTO
        </motion.button>
      </div>

      {/* Busca */}
      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ouro/70" />
        <input className={`${campo} pl-11`} placeholder="Buscar por nome, tipo, orixá ou entidade..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <p className="mt-4 font-texto text-xs text-creme/60">
        {lista.length} produtos · {totalDestaques} em destaque
        {totalDestaques > 5 && <span className="text-terracota"> (a página inicial mostra apenas 5)</span>}
      </p>

      {/* Lista */}
      {visiveis.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <motion.div className="text-ouro-claro" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <PackageOpen className="h-14 w-14" strokeWidth={1.2} />
          </motion.div>
          <p className="font-elegante text-2xl italic text-creme/70">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          <AnimatePresence mode="popLayout">
            {visiveis.map((p) => (
              <motion.li key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-wrap items-center gap-4 rounded-2xl border border-ouro/20 bg-musgo/40 p-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl" style={{ background: `linear-gradient(135deg, ${p.cores[0]}, ${p.cores[1]})` }}>
                  {p.imagem ? <img src={p.imagem} alt={p.nome} className="absolute inset-0 h-full w-full object-cover" /> : <MandalaIcone className="h-10 w-10" />}
                </div>

                <div className="min-w-0 flex-1 basis-44">
                  <p className="truncate font-elegante text-xl font-semibold text-creme">{p.nome}</p>
                  <p className="font-texto text-xs text-creme/60">{p.tipo} · {p.linha} · {p.divisao}</p>
                </div>

                <p className="font-titulo text-ouro-claro">{formatarPreco(p.preco)}</p>

                <div className="flex items-center gap-1">
                  <button onClick={() => aoAlternarDestaque(p.id)} className="rounded-full p-2 transition hover:bg-ouro/10" aria-label={p.destaque ? 'Tirar dos destaques' : 'Colocar nos destaques'} title={p.destaque ? 'Tirar dos destaques' : 'Colocar nos destaques'}>
                    <Star className={`h-5 w-5 ${p.destaque ? 'fill-ouro text-ouro' : 'text-creme/40'}`} />
                  </button>
                  <button onClick={() => setJanela({ tipo: 'form', produto: p })} className="rounded-full p-2 text-creme/70 transition hover:bg-ouro/10 hover:text-ouro-claro" aria-label="Editar" title="Editar">
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => setJanela({ tipo: 'excluir', produto: p })} className="rounded-full p-2 text-creme/70 transition hover:bg-terracota/20 hover:text-terracota" aria-label="Excluir" title="Excluir">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Janelas */}
      <AnimatePresence>
        {janela?.tipo === 'form' && (
          <Janela key="form" onFechar={() => setJanela(null)}>
            <FormularioProduto produto={janela.produto} onSalvar={aoSalvar} onFechar={() => setJanela(null)} />
          </Janela>
        )}

        {janela?.tipo === 'excluir' && (
          <Janela key="excluir" onFechar={() => setJanela(null)}>
            <h2 className="font-titulo text-xl text-ouro-claro">Excluir produto?</h2>
            <p className="mt-3 font-texto text-sm text-creme/80">
              Você vai excluir <strong>{janela.produto.nome}</strong>. Essa ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <motion.button onClick={() => setJanela(null)} className="rounded-full border border-ouro/40 px-6 py-3 font-titulo text-xs tracking-widest text-creme/80" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                CANCELAR
              </motion.button>
              <motion.button onClick={aoExcluir} className="rounded-full bg-terracota px-8 py-3 font-titulo text-xs font-bold tracking-widest text-creme" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                EXCLUIR
              </motion.button>
            </div>
          </Janela>
        )}
      </AnimatePresence>
    </motion.div>
  )
}