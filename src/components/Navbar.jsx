import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react'
import LogoGiratorio from './LogoGiratorio'

const LINKS = [
  { nome: 'Início', to: '/' },
  { nome: 'Produtos', to: '/produtos' },
  { nome: 'Sobre', to: '/#sobre' },
  { nome: 'Contato', to: '/#contato' },
]

const SUAVE = [0.22, 1, 0.36, 1]

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
      <Link to="/entrar" className="flex items-center gap-2 text-creme/80 transition-colors hover:text-creme" aria-label="Entrar">
        <User className="h-4.5 w-4.5" strokeWidth={1.5} />
        <span className="hidden font-texto text-xs font-medium uppercase tracking-[0.18em] sm:inline">Entrar</span>
      </Link>
    )
  }

  const primeiroNome = usuario.nome.split(' ')[0]
  const itemMenu = 'flex items-center gap-3 px-4 py-3 font-texto text-sm text-creme/75 transition-colors hover:bg-creme/5 hover:text-creme'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAberto(!aberto)}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-creme/25 font-elegante text-base text-creme transition-colors hover:border-ouro"
        aria-label="Menu da conta"
        aria-expanded={aberto}
      >
        {primeiroNome.charAt(0).toUpperCase()}
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            className="absolute right-0 top-full mt-4 w-64 overflow-hidden border border-linha bg-musgo shadow-2xl shadow-black/40"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: SUAVE }}
          >
            <div className="border-b border-linha px-4 py-4">
              <p className="font-elegante text-xl text-creme">Olá, {primeiroNome}</p>
              <p className="truncate font-texto text-xs text-creme/45">{usuario.email}</p>
            </div>

            <Link to="/conta" onClick={() => setAberto(false)} className={itemMenu}>
              <User className="h-4 w-4" strokeWidth={1.5} />
              Minha conta
            </Link>

            {usuario.papel === 'admin' && (
              <Link to="/admin" onClick={() => setAberto(false)} className={itemMenu}>
                <LayoutDashboard className="h-4 w-4" strokeWidth={1.5} />
                Painel administrativo
              </Link>
            )}

            <button onClick={() => { setAberto(false); onSair() }} className={`${itemMenu} w-full border-t border-linha`}>
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
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
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  function ativo(to) {
    if (to === '/') return pathname === '/' && !hash
    if (to.startsWith('/#')) return pathname === '/' && hash === to.slice(1)
    return pathname === to
  }

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,padding] duration-500 ${
        rolou || aberto ? 'border-linha bg-noite/85 py-3 backdrop-blur-md' : 'border-transparent py-5'
      }`}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: SUAVE }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-3" aria-label="Ateliê da Cabocla, página inicial">
          <LogoGiratorio className="h-8 w-8 transition-transform duration-1000 ease-out group-hover:rotate-180" />
          <span className="font-elegante text-xl font-medium tracking-wide text-creme sm:text-[22px]">
            Ateliê da Cabocla
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <li key={link.nome}>
              <Link
                to={link.to}
                className={`group relative font-texto text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                  ativo(link.to) ? 'text-creme' : 'text-creme/60 hover:text-creme'
                }`}
              >
                {link.nome}
                <span
                  className={`absolute -bottom-2 left-0 h-px w-full origin-left bg-ouro transition-transform duration-500 ease-out ${
                    ativo(link.to) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-6">
          <MenuUsuario usuario={usuario} onSair={onSair} />

          <button onClick={onAbrirCarrinho} className="relative text-creme/80 transition-colors hover:text-creme" aria-label="Abrir sacola">
            <ShoppingBag className="h-4.75 w-4.75" strokeWidth={1.5} />
            <AnimatePresence mode="popLayout">
              {quantidadeCarrinho > 0 && (
                <motion.span
                  key={quantidadeCarrinho}
                  className="absolute -right-2.5 -top-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-ouro px-1 font-texto text-[10px] font-semibold text-noite"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {quantidadeCarrinho}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Botão do menu (celular) */}
          <button className="flex h-8 w-8 flex-col items-end justify-center gap-1.7 md:hidden" onClick={() => setAberto(!aberto)} aria-label="Abrir menu" aria-expanded={aberto}>
            <motion.span className="block h-px w-6 bg-creme" animate={aberto ? { rotate: 45, y: 4, width: 24 } : { rotate: 0, y: 0, width: 24 }} />
            <motion.span className="block h-px bg-creme" animate={aberto ? { rotate: -45, y: -4, width: 24 } : { rotate: 0, y: 0, width: 16 }} />
          </button>
        </div>
      </nav>

      {/* Menu (celular) */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            className="overflow-hidden md:hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.5, ease: SUAVE }}
          >
            <ul className="flex flex-col px-6 pb-8 pt-6">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.nome}
                  className="border-b border-linha"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: SUAVE }}
                >
                  <Link to={link.to} onClick={() => setAberto(false)} className="flex items-baseline justify-between py-4 font-elegante text-3xl text-creme">
                    {link.nome}
                    <span className="font-texto text-[11px] text-creme/35">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}