import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Rodape from './components/Rodape'
import Carrinho from './components/Carrinho'
import RotaCliente from './components/RotaCliente'
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import Entrar from './pages/Entrar'
import Conta from './pages/Conta'
import Checkout from './pages/Checkout'
import AdminLayout from './pages/admin/AdminLayout'
import AdminCompras from './pages/admin/AdminCompras'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminProdutos from './pages/admin/AdminProdutos'
import AdminCategorias from './pages/admin/AdminCategorias'
import RotaProtegida from './pages/admin/RotaProtegida'
import { usuarioAtual, sair } from './services/auth'

// Ao trocar de página, volta ao topo (ou desce até a seção do link, como #sobre)
function RolarParaOLocal() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const elemento = document.querySelector(hash)
      if (elemento) {
        setTimeout(() => elemento.scrollIntoView({ behavior: 'smooth' }), 50)
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const usuario = usuarioAtual()
  const [, atualizar] = useState(0)

  const [itens, setItens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('carrinho')) || []
    } catch {
      return []
    }
  })
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens))
  }, [itens])

  function aoSair() {
    sair()
    setCarrinhoAberto(false)
    atualizar((n) => n + 1)
    // Se estiver numa página que exige login, volta para o início
    if (['/produtos', '/conta', '/checkout'].includes(pathname)) navigate('/')
  }

  function abrirCarrinho() {
    if (!usuario) {
      navigate('/entrar', { state: { de: pathname, aviso: true } })
      return
    }
    setCarrinhoAberto(true)
  }

  function adicionar(produto) {
    setItens((atual) => {
      const existe = atual.find((i) => i.produto.id === produto.id)
      if (existe) {
        return atual.map((i) =>
          i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        )
      }
      return [...atual, { produto, quantidade: 1 }]
    })
  }

  function alterarQuantidade(id, mudanca) {
    setItens((atual) =>
      atual
        .map((i) => (i.produto.id === id ? { ...i, quantidade: i.quantidade + mudanca } : i))
        .filter((i) => i.quantidade > 0)
    )
  }

  function remover(id) {
    setItens((atual) => atual.filter((i) => i.produto.id !== id))
  }

  const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0)

  // Área do administrador: sem menu, rodapé nem carrinho da loja
  if (pathname.startsWith('/admin')) {
    return (
      <>
        <RolarParaOLocal />
        <Routes>
          <Route path="/admin/login" element={<Navigate to="/entrar" replace />} />
          <Route
            path="/admin"
            element={
              <RotaProtegida>
                <AdminLayout />
              </RotaProtegida>
            }
          >
            <Route index element={<Navigate to="compras" replace />} />
            <Route path="compras" element={<AdminCompras />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="categorias" element={<AdminCategorias />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </>
    )
  }

  // Loja
  return (
    <>
      <RolarParaOLocal />
      <Navbar
        quantidadeCarrinho={usuario ? totalItens : 0}
        onAbrirCarrinho={abrirCarrinho}
        usuario={usuario}
        onSair={aoSair}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home onAdicionar={adicionar} />} />
          <Route
            path="/produtos"
            element={
              <RotaCliente>
                <Produtos onAdicionar={adicionar} />
              </RotaCliente>
            }
          />
          <Route
            path="/conta"
            element={
              <RotaCliente>
                <Conta />
              </RotaCliente>
            }
          />
          <Route
            path="/checkout"
            element={
              <RotaCliente>
                <Checkout itens={itens} onFinalizada={() => setItens([])} />
              </RotaCliente>
            }
          />
          <Route path="/entrar" element={<Entrar />} />
        </Routes>
      </main>
      <Rodape />
      <Carrinho
        aberto={carrinhoAberto && !!usuario}
        onFechar={() => setCarrinhoAberto(false)}
        itens={itens}
        onAlterar={alterarQuantidade}
        onRemover={remover}
      />
    </>
  )
}