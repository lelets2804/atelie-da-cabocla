import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { PRODUTOS, TIPOS, LINHAS } from '../../data/produtos'
import * as catalogo from '../../services/catalogo'

const campo =
  'w-full rounded-xl border border-ouro/30 bg-noite/70 px-4 py-2.5 font-texto text-sm text-creme placeholder:text-creme/40 outline-none transition focus:border-ouro focus:shadow-[0_0_20px_rgba(212,162,76,0.25)]'

function textoProdutos(n) {
  return `${n} ${n === 1 ? 'produto' : 'produtos'}`
}

function BotaoIcone({ Icone, rotulo, onClick, perigo = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`rounded-full p-2 transition ${
        perigo
          ? 'text-creme/70 hover:bg-terracota/20 hover:text-terracota'
          : 'text-creme/70 hover:bg-ouro/10 hover:text-ouro-claro'
      }`}
    >
      <Icone className="h-4 w-4" />
    </button>
  )
}

// Linha com nome, quantidade de produtos, renomear e remover
function ItemEditavel({ nome, detalhe, grande = false, onRenomear, onRemover }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(nome)
  const [confirmando, setConfirmando] = useState(false)

  function salvar(e) {
    e.preventDefault()
    if (onRenomear(texto)) setEditando(false)
  }

  if (editando) {
    return (
      <form onSubmit={salvar} className="flex items-center gap-1">
        <input
          autoFocus
          className={campo}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <BotaoIcone Icone={Check} rotulo="Salvar" onClick={salvar} />
        <BotaoIcone
          Icone={X}
          rotulo="Cancelar"
          onClick={() => {
            setEditando(false)
            setTexto(nome)
          }}
        />
      </form>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <p
          className={`truncate ${
            grande ? 'font-titulo text-lg text-ouro-claro' : 'font-texto text-sm text-creme'
          }`}
        >
          {nome}
        </p>
        {detalhe && <p className="font-texto text-xs text-creme/50">{detalhe}</p>}
      </div>

      {confirmando ? (
        <div className="flex items-center gap-2 font-texto text-xs">
          <span className="text-creme/70">Remover?</span>
          <button
            type="button"
            onClick={() => {
              setConfirmando(false)
              onRemover()
            }}
            className="rounded-full bg-terracota px-3 py-1 text-creme"
          >
            Sim
          </button>
          <button
            type="button"
            onClick={() => setConfirmando(false)}
            className="rounded-full border border-ouro/40 px-3 py-1 text-creme/80"
          >
            Não
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <BotaoIcone Icone={Pencil} rotulo="Renomear" onClick={() => setEditando(true)} />
          <BotaoIcone
            Icone={Trash2}
            rotulo="Remover"
            perigo
            onClick={() => setConfirmando(true)}
          />
        </div>
      )}
    </div>
  )
}

function NovoItem({ placeholder, onAdicionar }) {
  const [texto, setTexto] = useState('')

  function enviar(e) {
    e.preventDefault()
    if (onAdicionar(texto)) setTexto('')
  }

  return (
    <form onSubmit={enviar} className="flex gap-2">
      <input
        className={campo}
        placeholder={placeholder}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <motion.button
        type="submit"
        className="flex shrink-0 items-center gap-2 rounded-full border border-ouro px-5 py-2 font-titulo text-xs tracking-widest text-ouro-claro"
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="h-4 w-4" />
        ADICIONAR
      </motion.button>
    </form>
  )
}

function Secao({ titulo, texto, children }) {
  return (
    <motion.section
      className="mt-10 rounded-3xl border border-ouro/20 bg-ameixa/30 p-5 sm:p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-titulo text-xl text-ouro-claro">{titulo}</h2>
      <p className="mb-6 mt-1 font-texto text-sm text-creme/60">{texto}</p>
      {children}
    </motion.section>
  )
}

function Linha({ children }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-xl border border-ouro/15 bg-noite/50 px-4 py-2"
    >
      {children}
    </motion.li>
  )
}

export default function AdminCategorias() {
  const [, setVersao] = useState(0)
  const [aviso, setAviso] = useState(null)

  // Executa a ação, atualiza a tela e mostra o erro (se houver)
  function executar(acao) {
    const resultado = acao()
    setVersao((n) => n + 1)
    if (resultado.ok) {
      setAviso(null)
      return true
    }
    setAviso(resultado.erro)
    return false
  }

  const doTipo = (t) => PRODUTOS.filter((p) => p.tipo === t).length
  const daLinha = (l) => PRODUTOS.filter((p) => p.linha === l).length
  const daDivisao = (l, d) => PRODUTOS.filter((p) => p.linha === l && p.divisao === d).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent">
        Categorias
      </h1>
      <div className="mt-2 h-px w-24 bg-ouro" />
      <p className="mt-4 max-w-2xl font-texto text-sm text-creme/70">
        Aqui você controla as opções que aparecem nos filtros da loja e no cadastro de
        produtos. Ao renomear, as peças são atualizadas sozinhas. Para remover um item, ele
        precisa estar sem peças.
      </p>

      <AnimatePresence>
        {aviso && (
          <motion.p
            key={aviso}
            className="mt-6 rounded-xl border border-terracota/50 bg-terracota/15 px-4 py-3 font-texto text-sm text-terracota"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {aviso}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tipos */}
      <Secao
        titulo="Tipos de produto"
        texto="Por exemplo: guias, brajás, pulseiras e personalizados."
      >
        <ul className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {TIPOS.map((tipo) => (
              <Linha key={tipo}>
                <ItemEditavel
                  nome={tipo}
                  detalhe={textoProdutos(doTipo(tipo))}
                  onRenomear={(novo) => executar(() => catalogo.renomearTipo(tipo, novo))}
                  onRemover={() => executar(() => catalogo.removerTipo(tipo))}
                />
              </Linha>
            ))}
          </AnimatePresence>
        </ul>
        <div className="mt-4">
          <NovoItem
            placeholder="Novo tipo (ex.: Colares)"
            onAdicionar={(nome) => executar(() => catalogo.adicionarTipo(nome))}
          />
        </div>
      </Secao>

      {/* Linhas e divisões */}
      <Secao
        titulo="Linhas e divisões"
        texto="As linhas são os grandes grupos (Orixás e Entidades). Dentro de cada uma ficam as divisões, como Iemanjá, Ogum, Caboclo e Exu."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {Object.keys(LINHAS).map((linha) => (
            <div key={linha} className="rounded-2xl border border-ouro/20 bg-noite/40 p-5">
              <ItemEditavel
                grande
                nome={linha}
                detalhe={`${LINHAS[linha].length} divisões · ${textoProdutos(daLinha(linha))}`}
                onRenomear={(novo) => executar(() => catalogo.renomearLinha(linha, novo))}
                onRemover={() => executar(() => catalogo.removerLinha(linha))}
              />

              <div className="my-4 h-px bg-ouro/20" />

              <ul className="space-y-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {LINHAS[linha].map((divisao) => (
                    <Linha key={`${linha}-${divisao}`}>
                      <ItemEditavel
                        nome={divisao}
                        detalhe={textoProdutos(daDivisao(linha, divisao))}
                        onRenomear={(novo) =>
                          executar(() => catalogo.renomearDivisao(linha, divisao, novo))
                        }
                        onRemover={() =>
                          executar(() => catalogo.removerDivisao(linha, divisao))
                        }
                      />
                    </Linha>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-4">
                <NovoItem
                  placeholder={`Nova divisão em ${linha}`}
                  onAdicionar={(nome) => executar(() => catalogo.adicionarDivisao(linha, nome))}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 max-w-lg">
          <p className="mb-2 font-texto text-xs uppercase tracking-widest text-ouro/70">
            Criar uma nova linha
          </p>
          <NovoItem
            placeholder="Nome da nova linha"
            onAdicionar={(nome) => executar(() => catalogo.adicionarLinha(nome))}
          />
        </div>
      </Secao>
    </motion.div>
  )
}