import { supabase } from '../lib/supabase'

export const STATUS_COMPRA = [
  { id: 'aguardando', nome: 'Aguardando pagamento' },
  { id: 'pago', nome: 'Pago' },
  { id: 'enviado', nome: 'Enviado' },
  { id: 'entregue', nome: 'Entregue' },
  { id: 'cancelado', nome: 'Cancelado' },
]

const CAMPOS = `
  id, usuario_id, usuario_email, cliente_nome, cliente_whatsapp,
  endereco, pagamento, total, status, criado_em,
  itens_pedido ( produto_id, nome, divisao, preco, quantidade )
`

// Converte a linha do banco para o formato que as páginas usam
function converter(linha) {
  return {
    id: linha.id,
    usuarioId: linha.usuario_id,
    usuarioEmail: linha.usuario_email,
    cliente: { nome: linha.cliente_nome, whatsapp: linha.cliente_whatsapp },
    endereco: linha.endereco || {},
    pagamento: linha.pagamento,
    total: Number(linha.total),
    status: linha.status,
    criadoEm: linha.criado_em,
    itens: (linha.itens_pedido || []).map((i) => ({
      produtoId: i.produto_id,
      nome: i.nome,
      divisao: i.divisao,
      preco: Number(i.preco),
      quantidade: i.quantidade,
    })),
  }
}

// Administradora: o banco devolve todas as compras (as regras de segurança cuidam disso)
export async function listarCompras() {
  const { data, error } = await supabase.from('pedidos').select(CAMPOS).order('criado_em', { ascending: false })
  if (error) throw error
  return data.map(converter)
}

export async function listarComprasDoUsuario(usuarioId) {
  const { data, error } = await supabase
    .from('pedidos')
    .select(CAMPOS)
    .eq('usuario_id', usuarioId)
    .order('criado_em', { ascending: false })
  if (error) throw error
  return data.map(converter)
}

// Cria a compra no banco. O preço e o total são calculados lá, pela tabela de produtos.
export async function criarCompra(dados) {
  const { data: id, error } = await supabase.rpc('criar_pedido', {
    p_cliente: dados.cliente,
    p_endereco: dados.endereco,
    p_pagamento: dados.pagamento,
    p_itens: dados.itens.map((i) => ({ produto_id: i.produtoId, quantidade: i.quantidade })),
  })
  if (error) throw error

  const { data, error: erroLeitura } = await supabase.from('pedidos').select(CAMPOS).eq('id', id).single()
  if (erroLeitura) throw erroLeitura
  return converter(data)
}

export async function atualizarStatusCompra(id, status) {
  const { error } = await supabase.from('pedidos').update({ status }).eq('id', id)
  if (error) throw error
}