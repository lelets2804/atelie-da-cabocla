import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CreditCard, QrCode, Check, ShoppingBag } from 'lucide-react'
import { usuarioAtual } from '../services/auth'
import { criarCompra } from '../services/compras'

const campo =
  'w-full rounded-xl border border-ouro/30 bg-noite/70 px-4 py-3 font-texto text-sm text-creme placeholder:text-creme/40 outline-none transition focus:border-ouro focus:shadow-[0_0_20px_rgba(212,162,76,0.25)]'

const PAGAMENTOS = [
  { id: 'pix', nome: 'Pix', texto: 'Pagamento na hora', Icone: QrCode },
  { id: 'cartao', nome: 'Cartão de crédito', texto: 'Em até 12x', Icone: CreditCard },
]

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function mascaraCep(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 8)
  return n.length > 5 ? `${n.slice(0, 5)}-${n.slice(5)}` : n
}

function lerEndereco(usuarioId) {
  try {
    return JSON.parse(localStorage.getItem(`endereco-${usuarioId}`)) || {}
  } catch {
    return {}
  }
}

function Campo({ rotulo, children, className = '' }) {
  return (
    <label className={`block text-left ${className}`}>
      <span className="mb-2 block font-texto text-xs uppercase tracking-widest text-ouro/80">
        {rotulo}
      </span>
      {children}
    </label>
  )
}

function Titulo({ Icone, children }) {
  return (
    <h2 className="flex items-center gap-3 font-titulo text-lg text-ouro-claro">
      <Icone className="h-5 w-5" />
      {children}
    </h2>
  )
}

export default function Checkout({ itens, onFinalizada }) {
  const usuario = usuarioAtual()

  const [d, setD] = useState(() => ({
    nome: usuario?.nome || '',
    whatsapp: usuario?.whatsapp || '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    pagamento: 'pix',
    ...lerEndereco(usuario?.id),
  }))
  const [erro, setErro] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [compraFeita, setCompraFeita] = useState(null)

  const total = itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0)

  function mudar(nome, valor) {
    setD((atual) => ({ ...atual, [nome]: valor }))
  }

  async function mudarCep(valor) {
    const cep = mascaraCep(valor)
    mudar('cep', cep)

    const digitos = cep.replace(/\D/g, '')
    if (digitos.length !== 8) return

    setBuscando(true)
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`)
      const dados = await resposta.json()
      if (!dados.erro) {
        setD((atual) => ({
          ...atual,
          rua: dados.logradouro || atual.rua,
          bairro: dados.bairro || atual.bairro,
          cidade: dados.localidade || atual.cidade,
          estado: dados.uf || atual.estado,
        }))
      }
    } catch {
      // Sem internet ou CEP fora do ar: a cliente preenche à mão
    } finally {
      setBuscando(false)
    }
  }

  async function confirmar(e) {
    e.preventDefault()
    setErro('')

    const whatsapp = d.whatsapp.replace(/\D/g, '')
    const cep = d.cep.replace(/\D/g, '')

    if (!d.nome.trim()) return setErro('Digite seu nome.')
    if (whatsapp.length < 10) return setErro('Digite um WhatsApp válido, com DDD.')
    if (cep.length !== 8) return setErro('Digite um CEP válido.')
    if (!d.rua.trim() || !d.numero.trim() || !d.bairro.trim() || !d.cidade.trim()) {
      return setErro('Preencha rua, número, bairro e cidade.')
    }
    if (d.estado.trim().length !== 2) return setErro('Digite a sigla do estado (ex.: SP).')

    const endereco = {
      cep,
      rua: d.rua.trim(),
      numero: d.numero.trim(),
      complemento: d.complemento.trim(),
      bairro: d.bairro.trim(),
      cidade: d.cidade.trim(),
      estado: d.estado.trim().toUpperCase(),
    }

    setEnviando(true)
    try {
      const compra = await criarCompra({
        usuarioId: usuario.id,
        usuarioEmail: usuario.email,
        cliente: { nome: d.nome.trim(), whatsapp },
        endereco,
        pagamento: d.pagamento,
        itens: itens.map(({ produto, quantidade }) => ({
          produtoId: produto.id,
          nome: produto.nome,
          divisao: produto.divisao,
          preco: produto.preco,
          quantidade,
        })),
        total,
      })

      // Guarda o endereço para preencher sozinho na próxima compra
      try {
        localStorage.setItem(
          `endereco-${usuario.id}`,
          JSON.stringify({ ...endereco, nome: d.nome.trim(), whatsapp, pagamento: d.pagamento })
        )
      } catch {
        // sem problema se não couber
      }

      onFinalizada()
      setCompraFeita(compra)
    } catch {
      setErro('Não foi possível confirmar agora. Tente de novo em instantes.')
    } finally {
      setEnviando(false)
    }
  }

  /* ------------------------- Compra confirmada ------------------------ */
  if (compraFeita) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-32">
        <motion.div
          className="w-full max-w-lg rounded-3xl border border-ouro/30 bg-ameixa/40 p-10 text-center backdrop-blur"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-ouro to-ouro-claro text-noite"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            <Check className="h-12 w-12" strokeWidth={2.5} />
          </motion.div>

          <h1 className="mt-6 bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent">
            Pedido recebido!
          </h1>
          <p className="mt-2 font-titulo text-sm text-ouro-claro">
            Pedido #{String(compraFeita.id).slice(-5)}
          </p>
          <p className="mt-4 font-elegante text-xl text-creme/85">
            Obrigada pela compra, {compraFeita.cliente.nome.split(' ')[0]}! Em breve entraremos em
            contato pelo WhatsApp com o valor do frete e as instruções de pagamento.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/conta">
              <motion.span
                className="inline-block rounded-full bg-gradient-to-r from-ouro to-ouro-claro px-8 py-3 font-titulo text-xs font-bold tracking-widest text-noite"
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(212,162,76,0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                VER MINHA CONTA
              </motion.span>
            </Link>
            <Link to="/produtos">
              <motion.span
                className="inline-block rounded-full border border-ouro px-8 py-3 font-titulo text-xs tracking-widest text-ouro-claro"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                CONTINUAR COMPRANDO
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>
    )
  }

  /* --------------------------- Carrinho vazio -------------------------- */
  if (itens.length === 0) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pb-20 pt-32">
        <div className="text-center">
          <motion.div
            className="mx-auto text-ouro-claro"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShoppingBag className="mx-auto h-16 w-16" strokeWidth={1.2} />
          </motion.div>
          <p className="mt-4 font-elegante text-2xl italic text-creme/70">
            Seu carrinho está vazio.
          </p>
          <Link to="/produtos">
            <motion.span
              className="mt-6 inline-block rounded-full border border-ouro px-8 py-3 font-titulo text-xs tracking-widest text-ouro-claro"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              VER PRODUTOS
            </motion.span>
          </Link>
        </div>
      </section>
    )
  }

  /* ------------------------------ Checkout ----------------------------- */
  return (
    <section className="relative px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-elegante text-lg italic text-ouro-claro">quase lá</p>
          <h1 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-3xl font-bold text-transparent sm:text-4xl">
            Finalizar compra
          </h1>
        </motion.div>

        <form onSubmit={confirmar} className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Coluna da esquerda */}
          <div className="space-y-8">
            {/* Entrega */}
            <motion.div
              className="rounded-3xl border border-ouro/20 bg-ameixa/30 p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Titulo Icone={MapPin}>Entrega</Titulo>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Campo rotulo="Nome completo">
                  <input
                    className={campo}
                    value={d.nome}
                    onChange={(e) => mudar('nome', e.target.value)}
                    autoComplete="name"
                  />
                </Campo>
                <Campo rotulo="WhatsApp">
                  <input
                    className={campo}
                    value={d.whatsapp}
                    onChange={(e) => mudar('whatsapp', e.target.value)}
                    placeholder="(11) 90000-0000"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Campo>

                <Campo rotulo={buscando ? 'CEP (buscando...)' : 'CEP'}>
                  <input
                    className={campo}
                    value={d.cep}
                    onChange={(e) => mudarCep(e.target.value)}
                    placeholder="00000-000"
                    inputMode="numeric"
                    autoComplete="postal-code"
                  />
                </Campo>
                <Campo rotulo="Rua">
                  <input
                    className={campo}
                    value={d.rua}
                    onChange={(e) => mudar('rua', e.target.value)}
                    autoComplete="address-line1"
                  />
                </Campo>

                <Campo rotulo="Número">
                  <input
                    className={campo}
                    value={d.numero}
                    onChange={(e) => mudar('numero', e.target.value)}
                  />
                </Campo>
                <Campo rotulo="Complemento (opcional)">
                  <input
                    className={campo}
                    value={d.complemento}
                    onChange={(e) => mudar('complemento', e.target.value)}
                    placeholder="Apto, bloco..."
                  />
                </Campo>

                <Campo rotulo="Bairro">
                  <input
                    className={campo}
                    value={d.bairro}
                    onChange={(e) => mudar('bairro', e.target.value)}
                  />
                </Campo>
                <div className="grid grid-cols-[1fr_90px] gap-4">
                  <Campo rotulo="Cidade">
                    <input
                      className={campo}
                      value={d.cidade}
                      onChange={(e) => mudar('cidade', e.target.value)}
                    />
                  </Campo>
                  <Campo rotulo="UF">
                    <input
                      className={`${campo} uppercase`}
                      value={d.estado}
                      onChange={(e) => mudar('estado', e.target.value.slice(0, 2))}
                      maxLength={2}
                    />
                  </Campo>
                </div>
              </div>
            </motion.div>

            {/* Pagamento */}
            <motion.div
              className="rounded-3xl border border-ouro/20 bg-ameixa/30 p-6 sm:p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Titulo Icone={CreditCard}>Forma de pagamento</Titulo>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {PAGAMENTOS.map(({ id, nome, texto, Icone }) => {
                  const ativo = d.pagamento === id
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => mudar('pagamento', id)}
                      className={`relative flex items-center gap-4 rounded-2xl border p-5 text-left transition-colors ${
                        ativo ? 'border-ouro bg-ouro/10' : 'border-ouro/20 bg-noite/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                          ativo ? 'border-ouro text-ouro-claro' : 'border-ouro/30 text-creme/60'
                        }`}
                      >
                        <Icone className="h-6 w-6" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-titulo text-sm text-creme">{nome}</p>
                        <p className="font-texto text-xs text-creme/60">{texto}</p>
                      </div>
                      {ativo && (
                        <motion.span
                          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-ouro text-noite"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </motion.span>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <p className="mt-4 font-texto text-xs text-creme/60">
                Depois de confirmar, você recebe pelo WhatsApp o valor do frete e as instruções
                para pagar.
              </p>
            </motion.div>
          </div>

          {/* Resumo */}
          <motion.aside
            className="h-fit rounded-3xl border border-ouro/30 bg-noite/70 p-6 backdrop-blur lg:sticky lg:top-28"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Titulo Icone={ShoppingBag}>Resumo</Titulo>

            <ul className="mt-5 space-y-3">
              {itens.map(({ produto, quantidade }) => (
                <li key={produto.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-elegante text-lg leading-tight text-creme">
                      {produto.nome}
                    </p>
                    <p className="font-texto text-xs text-creme/50">
                      {quantidade} × {formatarPreco(produto.preco)}
                    </p>
                  </div>
                  <p className="shrink-0 font-texto text-sm text-ouro-claro">
                    {formatarPreco(produto.preco * quantidade)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="my-5 h-px bg-ouro/20" />

            <div className="flex justify-between font-texto text-sm text-creme/70">
              <span>Subtotal</span>
              <span>{formatarPreco(total)}</span>
            </div>
            <div className="mt-2 flex justify-between font-texto text-sm text-creme/70">
              <span>Frete</span>
              <span>A combinar</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-texto text-sm text-creme">Total</span>
              <span className="font-titulo text-2xl text-ouro-claro">{formatarPreco(total)}</span>
            </div>

            <AnimatePresence>
              {erro && (
                <motion.p
                  className="mt-4 font-texto text-sm text-terracota"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {erro}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={enviando}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite disabled:opacity-60"
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,162,76,0.6)' }}
              whileTap={{ scale: 0.97 }}
            >
              {enviando ? 'CONFIRMANDO...' : 'CONFIRMAR PEDIDO'}
            </motion.button>
          </motion.aside>
        </form>
      </div>
    </section>
  )
}