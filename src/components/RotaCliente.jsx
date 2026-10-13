import { Navigate, useLocation } from 'react-router-dom'
import { usuarioAtual } from '../services/auth'

// Só deixa passar quem estiver logado; os outros vão para a tela de entrar
export default function RotaCliente({ children }) {
  const usuario = usuarioAtual()
  const local = useLocation()

  if (!usuario) {
    return (
      <Navigate
        to="/entrar"
        replace
        state={{ de: local.pathname + local.hash, aviso: true }}
      />
    )
  }
  return children
}