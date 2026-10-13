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
  'w-full rounded-xl border border-ouro/30 bg-noite/70 px-4 py-3 font-texto text-sm text-creme placeholder:text-creme/40 outline-none transition focus:border-ouro focus:shadow-[0_0_20px_rgba(212,162,76,0.25)] [&>option]:bg-noite'

function Campo({ rotulo, children }) {
  return (
    <label className="block text-left">
      <span className="mb-2 block font-texto text-xs uppercase tracking-widest text-ouro/80">
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
      className="mx-auto max-w-2xl rounded-3xl border border-ouro/25 bg-ameixa/40 p-6 backdrop-blur sm:p-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-2xl font-bold text-transparent sm:text-3xl">
        Peça personalizada
      </h3>
      <p className="mt-2 font-elegante text-lg text-creme/80">
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
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-ouro to-ouro-claro text-noite"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            >
              <Check className="h-10 w-10" strokeWidth={2.5} />
            </motion.div>
            <p className="font-elegante text-2xl text-creme">Pedido enviado com sucesso!</p>
            <p className="font-texto text-sm text-creme/70">
              Em breve falaremos com você pelo WhatsApp.
            </p>
            <motion.button
              onClick={() => setEnviado(false)}
              className="mt-2 rounded-full border border-ouro px-6 py-2 font-titulo text-xs tracking-widest text-ouro-claro"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,162,76,0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              FAZER OUTRO PEDIDO
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={aoEnviar}
            className="mt-8 grid gap-5 sm:grid-cols-2"
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
              className="flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite disabled:opacity-60 sm:col-span-2"
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,162,76,0.6)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Send className="h-4 w-4" />
              {enviando ? 'ENVIANDO...' : 'ENVIAR PEDIDO'}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}