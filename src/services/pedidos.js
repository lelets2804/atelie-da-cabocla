const CHAVE = 'pedidosPersonalizados'

export function listarPedidos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}

export function listarPedidosDoUsuario(usuarioId) {
  return listarPedidos().filter((p) => p.usuarioId === usuarioId)
}

// TEMPORÁRIO: por enquanto o pedido fica salvo só neste navegador.
// Quando o backend estiver pronto, trocar o conteúdo destas funções por chamadas à API, por exemplo:
//
//   POST   URL_DA_API/pedidos-personalizados         (criar pedido)
//   GET    URL_DA_API/pedidos-personalizados         (listar, só para a administradora)
//   PATCH  URL_DA_API/pedidos-personalizados/:id     (mudar o status)
export async function enviarPedido(dados) {
  const pedido = {
    id: Date.now(),
    ...dados,
    status: 'novo',
    criadoEm: new Date().toISOString(),
  }
  localStorage.setItem(CHAVE, JSON.stringify([pedido, ...listarPedidos()]))
  return pedido
}

export function atualizarStatus(id, status) {
  const atualizados = listarPedidos().map((p) => (p.id === id ? { ...p, status } : p))
  localStorage.setItem(CHAVE, JSON.stringify(atualizados))
}