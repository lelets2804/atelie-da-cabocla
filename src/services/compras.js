const CHAVE = 'compras'

export const STATUS_COMPRA = [
  { id: 'aguardando', nome: 'Aguardando pagamento' },
  { id: 'pago', nome: 'Pago' },
  { id: 'enviado', nome: 'Enviado' },
  { id: 'entregue', nome: 'Entregue' },
  { id: 'cancelado', nome: 'Cancelado' },
]

export function listarCompras() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}

export function listarComprasDoUsuario(usuarioId) {
  return listarCompras().filter((c) => c.usuarioId === usuarioId)
}

// TEMPORÁRIO: por enquanto a compra fica salva só neste navegador.
// Quando o backend estiver pronto, trocar por chamadas à API, por exemplo:
//   POST   URL_DA_API/compras        (criar a compra e iniciar o pagamento)
//   GET    URL_DA_API/compras        (listar: a cliente vê as dela, a administradora vê todas)
//   PATCH  URL_DA_API/compras/:id    (mudar o status)
export async function criarCompra(dados) {
  const compra = {
    id: Date.now(),
    ...dados,
    status: 'aguardando',
    criadoEm: new Date().toISOString(),
  }
  localStorage.setItem(CHAVE, JSON.stringify([compra, ...listarCompras()]))
  return compra
}

export function atualizarStatusCompra(id, status) {
  const atualizadas = listarCompras().map((c) => (c.id === id ? { ...c, status } : c))
  localStorage.setItem(CHAVE, JSON.stringify(atualizadas))
}