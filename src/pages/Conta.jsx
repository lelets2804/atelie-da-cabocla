import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, ClipboardList, ShoppingBag, MapPin } from 'lucide-react'
import { usuarioAtual } from '../services/auth'
import { listarPedidosDoUsuario } from '../services/pedidos'
import { listarComprasDoUsuario } from '../services/compras'

const ETAPAS_PEDIDO = [
  ['novo', 'Recebido'],
  ['analise', 'Em análise'],
  ['producao', 'Em produção'],
  ['pronto', 'Pronto'],
  ['entregue', 'Entregue'],
]

const ETAPAS_COMPRA = [
  ['aguardando', 'Aguardando pagamento'],
  ['pago', 'Pago'],
  ['enviado', 'Enviado'],
  ['entregue', 'Entregue'],
]

const PAGAMENTO = { pix: 'Pix', cartao: 'Cartão de crédito' }

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarTelefone(digitos) {
  if (!digitos) return '—'
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
  }
  return digitos
}

function Progresso({ etapas, status }) {
  if (status === 'cancelado') {
    return (
      <span className="mt-5 inline-block rounded-full border border-terracota/50 bg-terracota/15 px-4 py-1 font-texto text-xs text-terracota">
        Cancelado
      </span>
    )
  }

  const atual = Math.max(0, etapas.findIndex(([id]) => id === status))
  const largura = ((atual + 0.5) / etapas.length) * 100

  return (
    <div className="mt-5">
      <div className="relative h-1 rounded-full bg-ouro/20">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ouro to-ouro-claro"
          initial={{ width: 0 }}
          animate={{ width: `${largura}%` }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
      </div>
      <div
        className="mt-3 grid text-center"
        style={{ gridTemplateColumns: `repeat(${etapas.length}, minmax(0, 1fr))` }}
      >
        {etapas.map(([id, nome], i) => (
          <span
            key={id}
            className={`font-texto text-[10px] sm:text-xs ${
              i <= atual ? 'text-ouro-claro' : 'text-creme/40'
            }`}
          >
            {nome}
          </span>
        ))}
      </div>
    </div>
  )
}

function Dado({ Icone, rotulo, valor }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-ouro/15 bg-noite/50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ouro/30 text-ouro-claro">
        <Icone className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="font-texto text-xs uppercase tracking-widest text-ouro/70">{rotulo}</p>
        <p className="truncate font-texto text-sm text-creme">{valor}</p>
      </div>
    </div>
  )
}

function Titulo({ Icone, children }) {
  return (
    <h2 className="flex items-center gap-3 font-titulo text-xl text-ouro-claro">
      <Icone className="h-5 w-5" />
      {children}
    </h2>
  )
}

export default function Conta() {
  const usuario = usuarioAtual()

  if (!usuario) return null

  const pedidos = listarPedidosDoUsuario(usuario.id)
  const compras = listarComprasDoUsuario(usuario.id)

  return (
    <section className="relative min-h-screen overflow-hidden px-6 pb-24 pt-32">
      <motion.div
        className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-roxo/30 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <motion.div
          className="flex items-center gap-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-ouro bg-ouro/15 font-titulo text-3xl text-ouro-claro"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            {usuario.nome.charAt(0).toUpperCase()}
          </motion.div>
          <div>
            <p className="font-elegante text-lg italic text-ouro-claro">minha conta</p>
            <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent sm:text-4xl">
              {usuario.nome}
            </h1>
          </div>
        </motion.div>

        {/* Dados */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Titulo Icone={User}>Meus dados</Titulo>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Dado Icone={User} rotulo="Nome" valor={usuario.nome} />
            <Dado Icone={Mail} rotulo="E-mail" valor={usuario.email} />
            <Dado Icone={Phone} rotulo="WhatsApp" valor={formatarTelefone(usuario.whatsapp)} />
          </div>
        </motion.div>

        {/* Compras */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Titulo Icone={ShoppingBag}>Minhas compras</Titulo>

          {compras.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-ouro/20 bg-ameixa/30 p-8 text-center">
              <p className="font-elegante text-xl italic text-creme/70">
                Você ainda não fez nenhuma compra.
              </p>
              <Link to="/produtos">
                <motion.span
                  className="mt-5 inline-block rounded-full border border-ouro px-6 py-2 font-titulo text-xs tracking-widest text-ouro-claro"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  VER PRODUTOS
                </motion.span>
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {compras.map((c, i) => (
                <motion.li
                  key={c.id}
                  className="rounded-2xl border border-ouro/20 bg-ameixa/40 p-6 backdrop-blur"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-titulo text-sm text-ouro-claro">
                      Compra #{String(c.id).slice(-5)}
                    </p>
                    <p className="font-texto text-xs text-creme/50">
                      {new Date(c.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {c.itens.map((item) => (
                      <li
                        key={item.produtoId}
                        className="flex items-start justify-between gap-3 font-texto text-sm"
                      >
                        <span className="text-creme/85">
                          {item.quantidade} × {item.nome}
                        </span>
                        <span className="shrink-0 text-ouro-claro">
                          {formatarPreco(item.preco * item.quantidade)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-ouro/15 pt-4">
                    <span className="font-texto text-xs text-creme/60">
                      {PAGAMENTO[c.pagamento] || c.pagamento}
                    </span>
                    <span className="font-titulo text-lg text-ouro-claro">
                      {formatarPreco(c.total)}
                    </span>
                  </div>

                  <p className="mt-3 flex items-start gap-2 font-texto text-xs text-creme/55">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ouro/70" />
                    <span>
                      {c.endereco.rua}, {c.endereco.numero}
                      {c.endereco.complemento ? ` — ${c.endereco.complemento}` : ''} ·{' '}
                      {c.endereco.bairro} · {c.endereco.cidade}/{c.endereco.estado}
                    </span>
                  </p>

                  <Progresso etapas={ETAPAS_COMPRA} status={c.status} />
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Pedidos personalizados */}
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <Titulo Icone={ClipboardList}>Meus pedidos personalizados</Titulo>

          {pedidos.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-ouro/20 bg-ameixa/30 p-8 text-center">
              <p className="font-elegante text-xl italic text-creme/70">
                Você ainda não fez nenhum pedido personalizado.
              </p>
              <Link to="/#contato">
                <motion.span
                  className="mt-5 inline-block rounded-full border border-ouro px-6 py-2 font-titulo text-xs tracking-widest text-ouro-claro"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  FAZER UM PEDIDO
                </motion.span>
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {pedidos.map((p, i) => (
                <motion.li
                  key={p.id}
                  className="rounded-2xl border border-ouro/20 bg-ameixa/40 p-6 backdrop-blur"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-titulo text-sm text-ouro-claro">
                      Pedido #{String(p.id).slice(-5)}
                    </p>
                    <p className="font-texto text-xs text-creme/50">
                      {new Date(p.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <p className="mt-2 font-elegante text-xl text-creme">
                    {[p.tipo, p.linha, p.divisao].filter(Boolean).join(' · ')}
                  </p>
                  <p className="mt-1 line-clamp-3 font-texto text-sm text-creme/70">
                    {p.descricao}
                  </p>
                  <Progresso etapas={ETAPAS_PEDIDO} status={p.status} />
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  )
}