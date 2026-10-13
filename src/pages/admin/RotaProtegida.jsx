import { Navigate } from 'react-router-dom'
import { usuarioAtual } from '../../services/auth'

export default function RotaProtegida({ children }) {
  const usuario = usuarioAtual()

  if (!usuario) return <Navigate to="/entrar" replace />
  if (usuario.papel !== 'admin') return <Navigate to="/" replace />

  return children
}