import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  ShoppingBag,
  Package,
  Tags,
  LogOut,
  Store,
  Sparkles,
} from 'lucide-react'
import { sair } from '../../services/auth'

const ITENS = [
  { to: '/admin/compras', nome: 'Compras', Icone: ShoppingBag },
  { to: '/admin/pedidos', nome: 'Pedidos personalizados', Icone: ClipboardList },
  { to: '/admin/produtos', nome: 'Produtos', Icone: Package },
  { to: '/admin/categorias', nome: 'Categorias', Icone: Tags },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  function aoSair() {
    sair()
    navigate('/entrar')
  }

  return (
    <div className="min-h-screen bg-noite text-creme lg:flex">
      <aside className="border-b border-ouro/20 bg-ameixa/30 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        {/* Topo: logo (e botões no celular) */}
        <div className="flex items-center justify-between px-5 py-4 lg:py-8">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-ouro"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-6 w-6" />
            </motion.span>
            <div>
              <p className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-base font-bold text-transparent">
                Ateliê da Cabocla
              </p>
              <p className="font-texto text-xs text-creme/50">Painel administrativo</p>
            </div>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Link to="/" className="p-2 text-ouro-claro" aria-label="Ver loja">
              <Store className="h-5 w-5" />
            </Link>
            <button onClick={aoSair} className="p-2 text-ouro-claro" aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {ITENS.map(({ to, nome, Icone }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative shrink-0 rounded-xl px-4 py-3 font-texto text-sm transition-colors ${
                  isActive ? 'text-ouro-claro' : 'text-creme/70 hover:text-creme'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="admin-menu-ativo"
                      className="absolute inset-0 rounded-xl border border-ouro/40 bg-ouro/15"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="relative flex items-center gap-3 whitespace-nowrap">
                    <Icone className="h-4 w-4" />
                    {nome}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Rodapé do menu (computador) */}
        <div className="hidden space-y-1 border-t border-ouro/20 p-4 lg:block">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 font-texto text-sm text-creme/70 transition hover:bg-ouro/10 hover:text-creme"
          >
            <Store className="h-4 w-4" />
            Ver a loja
          </Link>
          <button
            onClick={aoSair}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-texto text-sm text-creme/70 transition hover:bg-terracota/20 hover:text-creme"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}