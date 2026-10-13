import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Mail, Phone, Calendar, Inbox } from 'lucide-react'
import { listarPedidos, atualizarStatus } from '../../services/pedidos'

const STATUS = [
  { id: 'novo', nome: 'Recebido', cor: 'border-ouro/60 bg-ouro/15 text-ouro-claro' },
  { id: 'analise', nome: 'Em análise', cor: 'border-sky-400/50 bg-sky-400/10 text-sky-300' },
  { id: 'producao', nome: 'Em produção', cor: 'border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-300' },
  { id: 'pronto', nome: 'Pronto', cor: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' },
  { id: 'entregue', nome: 'Entregue', cor: 'border-creme/30 bg-creme/10 text-creme/80' },
  { id: 'cancelado', nome: 'Cancelado', cor: 'border-terracota/60 bg-terracota/15 text-terracota' },
]

function formatarTelefone(d = '') {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d || '—'
}

function linkWhats(p) {
  const digitos = p.whatsapp || ''
  const numero = digitos.length <= 11 ? `55${digitos}` : digitos
  const texto = `Olá, ${p.nome}! Aqui é do Ateliê da Cabocla, sobre o seu pedido personalizado #${String(p.id).slice(-5)}.`
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

function CartaoPedido({ pedido, onMudarStatus }) {
  const status = STATUS.find((s) => s.id === pedido.status) || STATUS[0]

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-ouro/20 bg-ameixa/40 p-5 backdrop-blur sm:p-6"
    >
      {/* Topo */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-texto text-xs uppercase tracking-widest text-ouro/70">
            Pedido #{String(pedido.id).slice(-5)}
          </p>
          <h3 className="font-elegante text-2xl font-semibold text-creme">{pedido.nome}</h3>
        </div>
        <span className={`rounded-full border px-4 py-1 font-texto text-xs ${status.cor}`}>
          {status.nome}
        </span>
      </div>

      {/* Contato */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-texto text-xs text-creme/70">
        <span className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-ouro/70" />
          {new Date(pedido.criadoEm).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </span>
        <span className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-ouro/70" />
          {formatarTelefone(pedido.whatsapp)}
        </span>
        {pedido.usuarioEmail && (
          <span className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-ouro/70" />
            {pedido.usuarioEmail}
          </span>
        )}
      </div>

      {/* Peça */}
      <p className="mt-4 font-titulo text-sm text-ouro-claro">
        {[pedido.tipo, pedido.linha, pedido.divisao].filter(Boolean).join(' · ')}
      </p>
      <p className="mt-2 whitespace-pre-wrap rounded-xl border border-ouro/15 bg-noite/50 p-4 font-texto text-sm leading-relaxed text-creme/85">
        {pedido.descricao}
      </p>

      {/* Ações */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3">
          <span className="font-texto text-xs uppercase tracking-widest text-ouro/70">
            Andamento
          </span>
          <select
            value={pedido.status}
            onChange={(e) => onMudarStatus(pedido.id, e.target.value)}
            className="rounded-xl border border-ouro/30 bg-noite/70 px-4 py-2 font-texto text-sm text-creme outline-none transition focus:border-ouro [&>option]:bg-noite"
          >
            {STATUS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </label>

        <motion.a
          href={linkWhats(pedido)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-ouro to-ouro-claro px-6 py-2.5 font-titulo text-xs font-bold tracking-widest text-noite"
          whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,162,76,0.5)' }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle className="h-4 w-4" />
          CHAMAR NO WHATSAPP
        </motion.a>
      </div>
    </motion.li>
  )
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState(() => listarPedidos())
  const [filtro, setFiltro] = useState('todos')

  function mudarStatus(id, status) {
    atualizarStatus(id, status)
    setPedidos(listarPedidos())
  }

  const visiveis = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.status === filtro)
  const quantos = (id) =>
    id === 'todos' ? pedidos.length : pedidos.filter((p) => p.status === id).length

  const filtros = [{ id: 'todos', nome: 'Todos' }, ...STATUS]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent">
        Pedidos personalizados
      </h1>
      <div className="mt-2 h-px w-24 bg-ouro" />

      {/* Filtros */}
      <div className="mt-8 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className="relative rounded-full px-4 py-2 font-texto text-xs text-creme"
          >
            {filtro === f.id && (
              <motion.span
                layoutId="pedido-filtro"
                className="absolute inset-0 rounded-full bg-gradient-to-r from-ouro to-ouro-claro"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            <span className={`relative z-10 ${filtro === f.id ? 'font-medium text-noite' : ''}`}>
              {f.nome} ({quantos(f.id)})
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {visiveis.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <motion.div
            className="text-ouro-claro"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Inbox className="h-14 w-14" strokeWidth={1.2} />
          </motion.div>
          <p className="font-elegante text-2xl italic text-creme/70">
            {pedidos.length === 0
              ? 'Nenhum pedido personalizado por enquanto.'
              : 'Nenhum pedido neste andamento.'}
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-5">
          <AnimatePresence mode="popLayout">
            {visiveis.map((p) => (
              <CartaoPedido key={p.id} pedido={p} onMudarStatus={mudarStatus} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  )
}