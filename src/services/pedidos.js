import { supabase } from '../lib/supabase'

const CAMPOS = 'id, usuario_id, usuario_email, nome, whatsapp, tipo, linha, divisao, descricao, status, criado_em'

// Converte a linha do banco para o formato que as páginas usam
function converter(linha) {
  return {
    id: linha.id,
    usuarioId: linha.usuario_id,
    usuarioEmail: linha.usuario_email,
    nome: linha.nome,
    whatsapp: linha.whatsapp,
    tipo: linha.tipo,
    linha: linha.linha,
    divisao: linha.divisao,
    descricao: linha.descricao,
    status: linha.status,
    criadoEm: linha.criado_em,
  }
}

// Administradora: o banco devolve todos os pedidos (as regras de segurança cuidam disso)
export async function listarPedidos() {
  const { data, error } = await supabase
    .from('pedidos_personalizados')
    .select(CAMPOS)
    .order('criado_em', { ascending: false })
  if (error) throw error
  return data.map(converter)
}

export async function listarPedidosDoUsuario(usuarioId) {
  const { data, error } = await supabase
    .from('pedidos_personalizados')
    .select(CAMPOS)
    .eq('usuario_id', usuarioId)
    .order('criado_em', { ascending: false })
  if (error) throw error
  return data.map(converter)
}

// Status e e-mail são preenchidos pelo próprio banco
export async function enviarPedido(dados) {
  const { data, error } = await supabase
    .from('pedidos_personalizados')
    .insert({
      usuario_id: dados.usuarioId,
      nome: dados.nome.trim(),
      whatsapp: dados.whatsapp,
      tipo: dados.tipo || null,
      linha: dados.linha || null,
      divisao: dados.divisao || null,
      descricao: dados.descricao.trim(),
    })
    .select(CAMPOS)
    .single()
  if (error) throw error
  return converter(data)
}

export async function atualizarStatus(id, status) {
  const { error } = await supabase.from('pedidos_personalizados').update({ status }).eq('id', id)
  if (error) throw error
}