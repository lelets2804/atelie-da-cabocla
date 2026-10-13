import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { entrar, criarConta } from '../services/auth'

const estiloCampo = 'w-full rounded-xl border border-ouro/30 bg-noite/70 py-3 pl-12 pr-4 font-texto text-sm text-creme placeholder:text-creme/40 outline-none transition focus:border-ouro focus:shadow-[0_0_20px_rgba(212,162,76,0.25)]'

const VAZIO = { nome: '', whatsapp: '', email: '', senha: '', confirmar: '' }

function Campo({ Icone, ...props }) {
  return (
    <div className="relative">
      <Icone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ouro/70" />
      <input className={estiloCampo} {...props} />
    </div>
  )
}

export default function Entrar() {
  const navigate = useNavigate()
  const local = useLocation()
  const destino = local.state?.de
  const aviso = local.state?.aviso

  const [modo, setModo] = useState(local.state?.modo || 'entrar')
  const [dados, setDados] = useState(VAZIO)
  const [erro, setErro] = useState('')

  function mudar(nome, valor) {
    setDados((atual) => ({ ...atual, [nome]: valor }))
  }

  function trocarModo(novo) {
    setModo(novo)
    setErro('')
  }

  function aoEnviar(e) {
    e.preventDefault()
    setErro('')

    if (modo === 'criar') {
      if (!dados.nome.trim()) return setErro('Digite seu nome.')
      if (dados.whatsapp.replace(/\D/g, '').length < 10) {
        return setErro('Digite um WhatsApp válido, com DDD.')
      }
    }
    if (!dados.email.includes('@') || !dados.email.includes('.')) {
      return setErro('Digite um e-mail válido.')
    }
    if (modo === 'criar' && dados.senha.length < 6) {
      return setErro('A senha precisa ter pelo menos 6 caracteres.')
    }
    if (modo === 'criar' && dados.senha !== dados.confirmar) {
      return setErro('As senhas não conferem.')
    }

    const resultado =
      modo === 'entrar'
        ? entrar(dados.email, dados.senha)
        : criarConta({
            nome: dados.nome.trim(),
            whatsapp: dados.whatsapp.replace(/\D/g, ''),
            email: dados.email,
            senha: dados.senha,
          })

    if (!resultado.ok) return setErro(resultado.erro)

    navigate(resultado.usuario.papel === 'admin' ? '/admin/pedidos' : destino || '/')
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-musgo),var(--color-noite)_70%)] px-6 pb-20 pt-32">
      <motion.div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-verde-claro/30 blur-3xl" animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-ouro/20 blur-3xl" animate={{ x: [0, -60, 0], y: [0, -40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />

      <motion.div className="relative w-full max-w-md rounded-3xl border border-ouro/30 bg-noite/70 p-8 shadow-2xl backdrop-blur-xl sm:p-10" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <motion.svg viewBox="0 0 200 200" className="mx-auto h-16 w-16" fill="none" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
          <circle cx="100" cy="100" r="92" stroke="#d4a24c" strokeWidth="3" strokeDasharray="10 14" />
          <circle cx="100" cy="100" r="68" stroke="#f0d28a" strokeWidth="2.5" />
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={i} cx="100" cy="100" rx="68" ry="20" stroke="#d4a24c" strokeWidth="2.5" transform={`rotate(${i * 22.5} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="7" fill="#f0d28a" />
        </motion.svg>

        <h1 className="mt-5 text-center font-titulo text-2xl font-bold text-ouro-claro">{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</h1>
        <p className="mt-1 text-center font-elegante text-lg text-creme/70">{modo === 'entrar' ? 'Acompanhe seus pedidos e compre com facilidade' : 'Leva só um minutinho'}</p>

        {aviso && (
          <motion.p className="mt-5 rounded-xl border border-ouro/30 bg-ouro/10 px-4 py-3 text-center font-texto text-sm text-ouro-claro" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            Para continuar, entre ou crie a sua conta.
          </motion.p>
        )}

        {/* Abas */}
        <div className="mt-6 flex rounded-full border border-ouro/25 p-1">
          {[['entrar', 'Entrar'], ['criar', 'Criar conta']].map(([id, nome]) => (
            <button key={id} type="button" onClick={() => trocarModo(id)} className="relative flex-1 rounded-full py-2 font-texto text-sm">
              {modo === id && (
                <motion.span layoutId="aba-ativa" className="absolute inset-0 rounded-full bg-gradient-to-r from-ouro to-ouro-claro" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
              )}
              <span className={`relative z-10 ${modo === id ? 'font-medium text-noite' : 'text-creme'}`}>{nome}</span>
            </button>
          ))}
        </div>

        <form onSubmit={aoEnviar} className="mt-6 space-y-4">
          <AnimatePresence initial={false}>
            {modo === 'criar' && (
              <motion.div key="extras" className="space-y-4 overflow-hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Campo Icone={User} placeholder="Seu nome" value={dados.nome} onChange={(e) => mudar('nome', e.target.value)} autoComplete="name" />
                <Campo Icone={Phone} placeholder="WhatsApp com DDD" value={dados.whatsapp} onChange={(e) => mudar('whatsapp', e.target.value)} inputMode="tel" autoComplete="tel" />
              </motion.div>
            )}
          </AnimatePresence>

          <Campo Icone={Mail} type="email" placeholder="E-mail" value={dados.email} onChange={(e) => mudar('email', e.target.value)} autoComplete="email" />
          <Campo Icone={Lock} type="password" placeholder="Senha" value={dados.senha} onChange={(e) => mudar('senha', e.target.value)} autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} />

          <AnimatePresence initial={false}>
            {modo === 'criar' && (
              <motion.div key="confirmar" className="overflow-hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Campo Icone={Lock} type="password" placeholder="Confirmar senha" value={dados.confirmar} onChange={(e) => mudar('confirmar', e.target.value)} autoComplete="new-password" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {erro && (
              <motion.p className="text-center font-texto text-sm text-terracota" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {erro}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button type="submit" className="w-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite" whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,162,76,0.6)' }} whileTap={{ scale: 0.97 }}>
            {modo === 'entrar' ? 'ENTRAR' : 'CRIAR MINHA CONTA'}
          </motion.button>
        </form>

        <p className="mt-5 text-center font-texto text-sm text-creme/60">
          {modo === 'entrar' ? 'Primeira vez aqui?' : 'Já tem conta?'}{' '}
          <button type="button" onClick={() => trocarModo(modo === 'entrar' ? 'criar' : 'entrar')} className="text-ouro-claro underline-offset-4 hover:underline">
            {modo === 'entrar' ? 'Crie sua conta' : 'Entrar'}
          </button>
        </p>
      </motion.div>
    </section>
  )
}