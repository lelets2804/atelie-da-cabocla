import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Mail, Phone, Calendar, MapPin, Inbox } from 'lucide-react'
import {
  listarCompras,
  atualizarStatusCompra,
  STATUS_COMPRA,
} from '../../services/compras'

const CORES = {
  aguardando: 'border-ouro/60 bg-ouro/15 text-ouro-claro',
  pago: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300',
  enviado: 'border-sky-400/50 bg-sky-400/10 text-sky-300',
  entregue: 'border-creme/30 bg-creme/10 text-creme/80',
  cancelado: 'border-terracota/60 bg-terracota/15 text-terracota',
}

const PAGAMENTO = { pix: 'Pix', cartao: 'Cartão de crédito' }

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarTelefone(d = '') {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return d || '—'
}

function linkWhats(c) {
  const digitos = c.cliente.whatsapp || ''
  const numero = digitos.length <= 11 ? `55${digitos}` : digitos
  const texto = `Olá, ${c.cliente.nome}! Aqui é do Ateliê da Cabocla, sobre a sua compra #${String(c.id).slice(-5)}. Vamos combinar o frete e o pagamento?`
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

function CartaoCompra({ compra, onMudarStatus }) {
  const status = STATUS_COMPRA.find((s) => s.id === compra.status) || STATUS_COMPRA[0]
  const e = compra.endereco

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
            Compra #{String(compra.id).slice(-5)}
          </p>
          <h3 className="font-elegante text-2xl font-semibold text-creme">
            {compra.cliente.nome}
          </h3>
        </div>
        <span className={`rounded-full border px-4 py-1 font-texto text-xs ${CORES[compra.status]}`}>
          {status.nome}
        </span>
      </div>

      {/* Contato */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-texto text-xs text-creme/70">
        <span className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-ouro/70" />
          {new Date(compra.criadoEm).toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </span>
        <span className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-ouro/70" />
          {formatarTelefone(compra.cliente.whatsapp)}
        </span>
        {compra.usuarioEmail && (
          <span className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-ouro/70" />
            {compra.usuarioEmail}
          </span>
        )}
      </div>

      {/* Itens */}
      <ul className="mt-4 space-y-2 rounded-xl border border-ouro/15 bg-noite/50 p-4">
        {compra.itens.map((item) => (
          <li
            key={item.produtoId}
            className="flex items-start justify-between gap-3 font-texto text-sm"
          >
            <span className="text-creme/85">
              {item.quantidade} × {item.nome}
              <span className="text-creme/45"> · {item.divisao}</span>
            </span>
            <span className="shrink-0 text-ouro-claro">
              {formatarPreco(item.preco * item.quantidade)}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between border-t border-ouro/15 pt-3">
          <span className="font-texto text-xs text-creme/60">
            {PAGAMENTO[compra.pagamento] || compra.pagamento} · frete a combinar
          </span>
          <span className="font-titulo text-lg text-ouro-claro">
            {formatarPreco(compra.total)}
          </span>
        </li>
      </ul>

      {/* Endereço */}
      <p className="mt-4 flex items-start gap-2 font-texto text-sm text-creme/75">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ouro/70" />
        <span>
          {e.rua}, {e.numero}
          {e.complemento ? ` — ${e.complemento}` : ''}
          <br />
          {e.bairro} · {e.cidade}/{e.estado} · CEP {e.cep}
        </span>
      </p>

      {/* Ações */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3">
          <span className="font-texto text-xs uppercase tracking-widest text-ouro/70">
            Andamento
          </span>
          <select
            value={compra.status}
            onChange={(ev) => onMudarStatus(compra.id, ev.target.value)}
            className="rounded-xl border border-ouro/30 bg-noite/70 px-4 py-2 font-texto text-sm text-creme outline-none transition focus:border-ouro [&>option]:bg-noite"
          >
            {STATUS_COMPRA.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </label>

        <motion.a
          href={linkWhats(compra)}
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

export default function AdminCompras() {
  const [compras, setCompras] = useState(() => listarCompras())
  const [filtro, setFiltro] = useState('todos')

  function mudarStatus(id, status) {
    atualizarStatusCompra(id, status)
    setCompras(listarCompras())
  }

  const visiveis = filtro === 'todos' ? compras : compras.filter((c) => c.status === filtro)
  const quantos = (id) =>
    id === 'todos' ? compras.length : compras.filter((c) => c.status === id).length

  const filtros = [{ id: 'todos', nome: 'Todas' }, ...STATUS_COMPRA]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent">
        Compras
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
                layoutId="compra-filtro"
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
            {compras.length === 0
              ? 'Nenhuma compra por enquanto.'
              : 'Nenhuma compra neste andamento.'}
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-5">
          <AnimatePresence mode="popLayout">
            {visiveis.map((c) => (
              <CartaoCompra key={c.id} compra={c} onMudarStatus={mudarStatus} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  )
}