import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, LayoutDashboard } from 'lucide-react'

const LINKS = [
  { nome: 'Início', to: '/' },
  { nome: 'Produtos', to: '/produtos' },
  { nome: 'Sobre', to: '/#sobre' },
  { nome: 'Contato', to: '/#contato' },
]

function MenuUsuario({ usuario, onSair }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)

  // Fecha o menu ao clicar fora dele
  useEffect(() => {
    function aoClicarFora(e) {
      if (ref.current && !ref.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  if (!usuario) {
    return (
      <Link to="/entrar" aria-label="Entrar">
        <motion.span className="flex items-center gap-2 text-ouro-claro" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <User className="h-6 w-6" strokeWidth={1.6} />
          <span className="hidden font-texto text-sm tracking-wider sm:inline">Entrar</span>
        </motion.span>
      </Link>
    )
  }

  const primeiroNome = usuario.nome.split(' ')[0]

  return (
    <div ref={ref} className="relative">
      <motion.button onClick={() => setAberto(!aberto)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ouro bg-ouro/15 font-titulo text-sm text-ouro-claro" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Menu da conta">
        {primeiroNome.charAt(0).toUpperCase()}
      </motion.button>

      <AnimatePresence>
        {aberto && (
          <motion.div className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-2xl border border-ouro/30 bg-noite/95 p-2 shadow-2xl backdrop-blur-lg" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}>
            <div className="px-4 py-3">
              <p className="font-elegante text-xl text-creme">Olá, {primeiroNome}</p>
              <p className="truncate font-texto text-xs text-creme/50">{usuario.email}</p>
            </div>
            <div className="my-1 h-px bg-ouro/20" />

            <Link to="/conta" onClick={() => setAberto(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-texto text-sm text-creme/80 transition hover:bg-ouro/10 hover:text-ouro-claro">
              <User className="h-4 w-4" />
              Minha conta
            </Link>

            {usuario.papel === 'admin' && (
              <Link to="/admin" onClick={() => setAberto(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-texto text-sm text-creme/80 transition hover:bg-ouro/10 hover:text-ouro-claro">
                <LayoutDashboard className="h-4 w-4" />
                Painel administrativo
              </Link>
            )}

            <button onClick={() => { setAberto(false); onSair() }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-texto text-sm text-creme/80 transition hover:bg-terracota/20 hover:text-creme">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar({ quantidadeCarrinho = 0, onAbrirCarrinho, usuario, onSair }) {
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40)
    aoRolar()
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <motion.header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${rolou ? 'bg-noite/80 py-3 shadow-lg shadow-black/30 backdrop-blur-lg' : 'py-5'}`} initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.svg viewBox="0 0 200 200" className="h-8 w-8" fill="none" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
            <circle cx="100" cy="100" r="92" stroke="#d4a24c" strokeWidth="5" strokeDasharray="12 18" />
            <circle cx="100" cy="100" r="68" stroke="#f0d28a" strokeWidth="4" />
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse key={i} cx="100" cy="100" rx="68" ry="20" stroke="#d4a24c" strokeWidth="4" transform={`rotate(${i * 22.5} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="9" fill="#f0d28a" />
          </motion.svg>
          <span className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-lg font-bold text-transparent sm:text-xl">Ateliê da Cabocla</span>
        </Link>

        {/* Links (desktop) */}
        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.nome}>
              <Link to={link.to} className="group relative font-texto text-sm tracking-wider text-creme/90 transition-colors hover:text-ouro-claro">
                {link.nome}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-ouro transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {/* Conta */}
          <MenuUsuario usuario={usuario} onSair={onSair} />

          {/* Carrinho */}
          <motion.button onClick={onAbrirCarrinho} className="relative text-ouro-claro" whileHover={{ scale: 1.15, rotate: -8 }} whileTap={{ scale: 0.9 }} aria-label="Abrir carrinho">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l1 13H5L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <AnimatePresence mode="popLayout">
              {quantidadeCarrinho > 0 && (
                <motion.span key={quantidadeCarrinho} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracota text-xs font-medium text-creme" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  {quantidadeCarrinho}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Botão do menu (celular) */}
          <button className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden" onClick={() => setAberto(!aberto)} aria-label="Abrir menu">
            <motion.span className="block h-0.5 w-6 bg-ouro-claro" animate={aberto ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} />
            <motion.span className="block h-0.5 w-6 bg-ouro-claro" animate={{ opacity: aberto ? 0 : 1 }} />
            <motion.span className="block h-0.5 w-6 bg-ouro-claro" animate={aberto ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} />
          </button>
        </div>
      </nav>

      {/* Menu (celular) */}
      <AnimatePresence>
        {aberto && (
          <motion.ul className="mx-4 mt-4 flex flex-col gap-1 overflow-hidden rounded-2xl border border-ouro/30 bg-noite/95 p-4 backdrop-blur-lg md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {LINKS.map((link, i) => (
              <motion.li key={link.nome} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={link.to} onClick={() => setAberto(false)} className="block rounded-lg px-4 py-3 font-titulo text-sm tracking-widest text-creme hover:bg-ouro/10 hover:text-ouro-claro">
                  {link.nome}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}