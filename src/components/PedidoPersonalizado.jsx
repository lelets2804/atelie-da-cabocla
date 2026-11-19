import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import { TIPOS, LINHAS } from '../data/produtos'
import { enviarPedido } from '../services/pedidos'
import { usuarioAtual } from '../services/auth'
import ConviteCadastro from './ConviteCadastro'

const VAZIO = {
  nome: '',
  whatsapp: '',
  tipo: '',
  linha: '',
  divisao: '',
  descricao: '',
}

const campo =
  'w-full rounded-none border-0 border-b border-creme/20 bg-transparent px-0 py-3 font-texto text-[15px] text-creme placeholder:text-creme/30 outline-none transition-colors focus:border-ouro [&>option]:bg-noite'

function Campo({ rotulo, children }) {
  return (
    <label className="block text-left">
      <span className="block font-texto text-[11px] font-medium uppercase tracking-[0.2em] text-creme/45">
        {rotulo}
      </span>
      {children}
    </label>
  )
}

export default function PedidoPersonalizado() {
  const navigate = useNavigate()
  const usuario = usuarioAtual()

  const [dados, setDados] = useState({
    ...VAZIO,
    nome: usuario?.nome || '',
    whatsapp: usuario?.whatsapp || '',
  })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  // Sem login, não mostra o formulário
  if (!usuario) {
    return (
      <ConviteCadastro
        titulo="Peça a sua peça personalizada"
        texto="Entre ou crie sua conta para enviar o seu pedido e acompanhar o andamento."
      />
    )
  }

  function mudar(nome, valor) {
    setDados((atual) => ({
      ...atual,
      [nome]: valor,
      ...(nome === 'linha' ? { divisao: '' } : {}),
    }))
  }

  async function aoEnviar(e) {
    e.preventDefault()
    setErro('')

    // Confere de novo se a pessoa continua logada
    const logado = usuarioAtual()
    if (!logado) {
      navigate('/entrar', { state: { de: '/#contato', aviso: true } })
      return
    }

    const digitos = dados.whatsapp.replace(/\D/g, '')
    if (!dados.nome.trim() || !dados.tipo || !dados.descricao.trim()) {
      setErro('Preencha seu nome, o tipo de peça e a descrição.')
      return
    }
    if (digitos.length < 10) {
      setErro('Digite um WhatsApp válido, com DDD.')
      return
    }

    setEnviando(true)
    try {
      await enviarPedido({
        ...dados,
        whatsapp: digitos,
        usuarioId: logado.id,
        usuarioEmail: logado.email,
      })
      setEnviado(true)
      setDados({ ...VAZIO, nome: logado.nome, whatsapp: logado.whatsapp || '' })
    } catch {
      setErro('Não foi possível enviar agora. Tente de novo em instantes.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <motion.div
      className="border border-linha bg-musgo/50 p-6 sm:p-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="font-elegante text-3xl font-medium text-creme sm:text-4xl">
        Peça personalizada
      </h3>
      <p className="mt-2 font-texto text-sm text-creme/55">
        Conte como você imagina a sua peça e a gente entra em contato.
      </p>

      <AnimatePresence mode="wait">
        {enviado ? (
          <motion.div
            key="ok"
            className="flex flex-col items-center gap-4 py-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-ouro text-ouro"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <Check className="h-7 w-7" strokeWidth={1.5} />
            </motion.div>
            <p className="font-elegante text-3xl text-creme">Pedido enviado!</p>
            <p className="font-texto text-sm text-creme/70">
              Em breve falaremos com você pelo WhatsApp.
            </p>
            <motion.button
              onClick={() => setEnviado(false)}
              className="mt-2 font-texto text-xs font-semibold uppercase tracking-[0.2em] text-creme/70 underline decoration-ouro/60 underline-offset-[6px] hover:text-creme"
            >
              Fazer outro pedido
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={aoEnviar}
            className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Campo rotulo="Seu nome">
              <input
                className={campo}
                value={dados.nome}
                onChange={(e) => mudar('nome', e.target.value)}
                placeholder="Como podemos te chamar?"
              />
            </Campo>

            <Campo rotulo="WhatsApp">
              <input
                className={campo}
                value={dados.whatsapp}
                onChange={(e) => mudar('whatsapp', e.target.value)}
                placeholder="(11) 90000-0000"
                inputMode="tel"
              />
            </Campo>

            <Campo rotulo="Tipo de peça">
              <select
                className={campo}
                value={dados.tipo}
                onChange={(e) => mudar('tipo', e.target.value)}
              >
                <option value="">Escolha...</option>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Campo>

            <Campo rotulo="Linha">
              <select
                className={campo}
                value={dados.linha}
                onChange={(e) => mudar('linha', e.target.value)}
              >
                <option value="">Escolha...</option>
                {Object.keys(LINHAS).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </Campo>

            {dados.linha && (
              <div className="sm:col-span-2">
                <Campo rotulo={dados.linha === 'Orixás' ? 'Orixá' : 'Entidade'}>
                  <select
                    className={campo}
                    value={dados.divisao}
                    onChange={(e) => mudar('divisao', e.target.value)}
                  >
                    <option value="">Escolha...</option>
                    {LINHAS[dados.linha].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Campo>
              </div>
            )}

            <div className="sm:col-span-2">
              <Campo rotulo="Descreva a peça que você quer">
                <textarea
                  className={`${campo} min-h-32 resize-y`}
                  value={dados.descricao}
                  onChange={(e) => mudar('descricao', e.target.value)}
                  placeholder="Cores, tamanho, material, nome para gravar..."
                />
              </Campo>
            </div>

            <AnimatePresence>
              {erro && (
                <motion.p
                  className="font-texto text-sm text-terracota sm:col-span-2"
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
              className="mt-2 flex items-center justify-center gap-3 rounded-sm bg-creme py-4 font-texto text-xs font-semibold uppercase tracking-[0.2em] text-noite transition-colors hover:bg-ouro-claro disabled:opacity-60 sm:col-span-2"
              whileTap={{ scale: 0.98 }}
            >
              <Send className="h-4 w-4" />
              {enviando ? 'Enviando...' : 'Enviar pedido'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}