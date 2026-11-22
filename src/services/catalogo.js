import { supabase } from '../lib/supabase'
import { PRODUTOS, TIPOS, LINHAS, IDS, carregarCatalogo } from '../data/produtos'

const BUCKET = 'produtos'

/* ----------------------------- Utilidades ----------------------------- */

function normalizar(texto) {
  return texto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Devolve uma mensagem de erro, ou null se o nome é válido
function validar(nome, lista, ignorar) {
  if (!nome || !nome.trim()) return 'Digite um nome.'
  const repetido = lista.some((x) => x !== ignorar && normalizar(x) === normalizar(nome))
  if (repetido) return 'Já existe um item com esse nome.'
  return null
}

function textoProdutos(n) {
  return `${n} ${n === 1 ? 'produto' : 'produtos'}`
}

function erroAmigavel(erro) {
  console.error('Erro no catálogo:', erro)
  const mensagem = (erro?.message || '').toLowerCase()

  if (erro?.code === '23505') return 'Já existe um item com esse nome.'
  if (erro?.code === '23503') return 'Este item ainda está em uso e não pode ser removido.'
  if (erro?.code === '42501' || mensagem.includes('row-level security')) {
    return 'Sem permissão. Entre com a conta de administradora.'
  }
  if (mensagem.includes('failed to fetch')) {
    return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'
  }
  return `Não foi possível salvar: ${erro?.message || 'erro desconhecido.'}`
}

// Executa a gravação, confere se algo realmente mudou e recarrega o catálogo
async function aplicar(consulta) {
  try {
    const { data, error } = await consulta
    if (error) return { ok: false, erro: erroAmigavel(error) }
    if (Array.isArray(data) && data.length === 0) {
      return { ok: false, erro: 'Nada foi alterado. Entre com a conta de administradora e tente de novo.' }
    }
    await carregarCatalogo()
    return { ok: true }
  } catch (erro) {
    return { ok: false, erro: erroAmigavel(erro) }
  }
}

/* ------------------------------- Fotos -------------------------------- */

async function enviarFoto(imagemBase64) {
  const resposta = await fetch(imagemBase64)
  const arquivo = await resposta.blob()
  const caminho = `${crypto.randomUUID()}.jpg`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(caminho, arquivo, { contentType: 'image/jpeg', cacheControl: '31536000' })
  if (error) throw error

  return supabase.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl
}

function caminhoDaFoto(url) {
  if (!url) return null
  const marca = `/storage/v1/object/public/${BUCKET}/`
  const indice = url.indexOf(marca)
  return indice >= 0 ? decodeURIComponent(url.slice(indice + marca.length)) : null
}

// Apaga a foto antiga do Storage (se falhar, não atrapalha o resto)
async function apagarFoto(url) {
  const caminho = caminhoDaFoto(url)
  if (!caminho) return
  try {
    await supabase.storage.from(BUCKET).remove([caminho])
  } catch {
    // sem problema
  }
}

/* ---------------------------- Produtos ---------------------------- */

// Cria o produto (sem id) ou atualiza o existente (com id)
// Devolve { ok: true } ou { ok: false, erro: '...' }
export async function salvarProduto(dados) {
  const tipoId = IDS.tipos[dados.tipo]
  const linhaId = IDS.linhas[dados.linha]
  const divisaoId = IDS.divisoes[`${dados.linha}|${dados.divisao}`]
  if (!tipoId || !linhaId || !divisaoId) {
    return { ok: false, erro: 'Tipo, linha ou divisão não encontrados. Recarregue a página.' }
  }

  const anterior = dados.id ? PRODUTOS.find((p) => p.id === dados.id) : null

  try {
    // Foto nova (vem como data:image...) vai para o Storage; as demais seguem como estão
    let fotoUrl = dados.imagem || null
    if (fotoUrl && fotoUrl.startsWith('data:')) {
      fotoUrl = await enviarFoto(fotoUrl)
    }

    const linha = {
      nome: dados.nome,
      tipo_id: tipoId,
      linha_id: linhaId,
      divisao_id: divisaoId,
      preco: dados.preco,
      cores: dados.cores,
      destaque: !!dados.destaque,
      foto_url: fotoUrl,
    }

    const consulta = anterior
      ? supabase.from('produtos').update(linha).eq('id', anterior.id).select('id')
      : supabase.from('produtos').insert(linha).select('id')

    const resultado = await aplicar(consulta)

    // Se a foto mudou ou foi removida, limpa a antiga
    if (resultado.ok && anterior?.imagem && anterior.imagem !== fotoUrl) {
      await apagarFoto(anterior.imagem)
    }
    return resultado
  } catch (erro) {
    return { ok: false, erro: erroAmigavel(erro) }
  }
}

export async function excluirProduto(id) {
  const anterior = PRODUTOS.find((p) => p.id === id)
  const resultado = await aplicar(supabase.from('produtos').delete().eq('id', id).select('id'))
  if (resultado.ok && anterior?.imagem) await apagarFoto(anterior.imagem)
  return resultado
}

export async function alternarDestaque(id) {
  const produto = PRODUTOS.find((p) => p.id === id)
  if (!produto) return { ok: false, erro: 'Produto não encontrado.' }
  return aplicar(
    supabase.from('produtos').update({ destaque: !produto.destaque }).eq('id', id).select('id')
  )
}

/* ------------------------------ Tipos ------------------------------ */

export async function adicionarTipo(nome) {
  const erro = validar(nome, TIPOS)
  if (erro) return { ok: false, erro }
  return aplicar(supabase.from('tipos').insert({ nome: nome.trim() }).select('id'))
}

export async function renomearTipo(antigo, novo) {
  const erro = validar(novo, TIPOS, antigo)
  if (erro) return { ok: false, erro }
  const id = IDS.tipos[antigo]
  if (!id) return { ok: false, erro: 'Item não encontrado.' }
  return aplicar(supabase.from('tipos').update({ nome: novo.trim() }).eq('id', id).select('id'))
}

export async function removerTipo(nome) {
  const usados = PRODUTOS.filter((p) => p.tipo === nome).length
  if (usados > 0) {
    return {
      ok: false,
      erro: `Existem ${textoProdutos(usados)} do tipo "${nome}". Mude ou exclua essas peças antes de remover.`,
    }
  }
  const id = IDS.tipos[nome]
  if (!id) return { ok: false, erro: 'Item não encontrado.' }
  return aplicar(supabase.from('tipos').delete().eq('id', id).select('id'))
}

/* ------------------------------ Linhas ----------------------------- */

export async function adicionarLinha(nome) {
  const erro = validar(nome, Object.keys(LINHAS))
  if (erro) return { ok: false, erro }
  return aplicar(supabase.from('linhas').insert({ nome: nome.trim() }).select('id'))
}

export async function renomearLinha(antiga, nova) {
  const erro = validar(nova, Object.keys(LINHAS), antiga)
  if (erro) return { ok: false, erro }
  const id = IDS.linhas[antiga]
  if (!id) return { ok: false, erro: 'Item não encontrado.' }
  return aplicar(supabase.from('linhas').update({ nome: nova.trim() }).eq('id', id).select('id'))
}

export async function removerLinha(nome) {
  const divisoes = (LINHAS[nome] || []).length
  if (divisoes > 0) {
    return {
      ok: false,
      erro: `A linha "${nome}" ainda tem ${divisoes} divisões. Remova as divisões antes.`,
    }
  }
  const usados = PRODUTOS.filter((p) => p.linha === nome).length
  if (usados > 0) {
    return {
      ok: false,
      erro: `Existem ${textoProdutos(usados)} na linha "${nome}". Mude ou exclua essas peças antes de remover.`,
    }
  }
  const id = IDS.linhas[nome]
  if (!id) return { ok: false, erro: 'Item não encontrado.' }
  return aplicar(supabase.from('linhas').delete().eq('id', id).select('id'))
}

/* ---------------------------- Divisões ----------------------------- */

export async function adicionarDivisao(linha, nome) {
  const lista = LINHAS[linha]
  if (!lista) return { ok: false, erro: 'Linha não encontrada.' }

  const erro = validar(nome, lista)
  if (erro) return { ok: false, erro }
  return aplicar(
    supabase.from('divisoes').insert({ linha_id: IDS.linhas[linha], nome: nome.trim() }).select('id')
  )
}

export async function renomearDivisao(linha, antiga, nova) {
  const lista = LINHAS[linha]
  if (!lista) return { ok: false, erro: 'Linha não encontrada.' }

  const erro = validar(nova, lista, antiga)
  if (erro) return { ok: false, erro }
  const id = IDS.divisoes[`${linha}|${antiga}`]
  if (!id) return { ok: false, erro: 'Item não encontrado.' }
  return aplicar(supabase.from('divisoes').update({ nome: nova.trim() }).eq('id', id).select('id'))
}

export async function removerDivisao(linha, nome) {
  const lista = LINHAS[linha]
  if (!lista) return { ok: false, erro: 'Linha não encontrada.' }

  const usados = PRODUTOS.filter((p) => p.linha === linha && p.divisao === nome).length
  if (usados > 0) {
    return {
      ok: false,
      erro: `Existem ${textoProdutos(usados)} em "${nome}". Mude ou exclua essas peças antes de remover.`,
    }
  }
  const id = IDS.divisoes[`${linha}|${nome}`]
  if (!id) return { ok: false, erro: 'Item não encontrado.' }
  return aplicar(supabase.from('divisoes').delete().eq('id', id).select('id'))
}