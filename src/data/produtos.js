import { supabase } from '../lib/supabase'

// Catálogo da loja, carregado do Supabase quando o site abre (veja main.jsx).
// Estas listas são alteradas "no lugar" por carregarCatalogo(), por isso as telas
// sempre enxergam a versão mais recente.
export const TIPOS = [] // ['Guias', 'Brajás', ...]
export const LINHAS = {} // { Orixás: ['Iemanjá', ...], Entidades: [...] }
export const PRODUTOS = [] // [{ id, nome, tipo, linha, divisao, preco, cores, destaque, imagem }]

// Números de identificação do banco, usados só pelos serviços ao gravar
export const IDS = { tipos: {}, linhas: {}, divisoes: {} }

function limpar(objeto) {
  Object.keys(objeto).forEach((chave) => delete objeto[chave])
}

export async function carregarCatalogo() {
  const [tipos, linhas, divisoes, produtos] = await Promise.all([
    supabase.from('tipos').select('id, nome').order('id'),
    supabase.from('linhas').select('id, nome').order('id'),
    supabase.from('divisoes').select('id, linha_id, nome').order('id'),
    supabase
      .from('produtos')
      .select('id, nome, tipo_id, linha_id, divisao_id, preco, cores, destaque, foto_url')
      .order('id', { ascending: false }),
  ])

  const erro = tipos.error || linhas.error || divisoes.error || produtos.error
  if (erro) throw erro

  const nomeDoTipo = new Map(tipos.data.map((t) => [t.id, t.nome]))
  const nomeDaLinha = new Map(linhas.data.map((l) => [l.id, l.nome]))
  const nomeDaDivisao = new Map(divisoes.data.map((d) => [d.id, d.nome]))

  TIPOS.splice(0, TIPOS.length, ...tipos.data.map((t) => t.nome))

  limpar(LINHAS)
  linhas.data.forEach((l) => {
    LINHAS[l.nome] = divisoes.data.filter((d) => d.linha_id === l.id).map((d) => d.nome)
  })

  limpar(IDS.tipos)
  limpar(IDS.linhas)
  limpar(IDS.divisoes)
  tipos.data.forEach((t) => (IDS.tipos[t.nome] = t.id))
  linhas.data.forEach((l) => (IDS.linhas[l.nome] = l.id))
  divisoes.data.forEach((d) => {
    IDS.divisoes[`${nomeDaLinha.get(d.linha_id)}|${d.nome}`] = d.id
  })

  PRODUTOS.splice(
    0,
    PRODUTOS.length,
    ...produtos.data.map((p) => ({
      id: p.id,
      nome: p.nome,
      tipo: nomeDoTipo.get(p.tipo_id) || '',
      linha: nomeDaLinha.get(p.linha_id) || '',
      divisao: nomeDaDivisao.get(p.divisao_id) || '',
      preco: Number(p.preco),
      cores: p.cores?.length === 2 ? p.cores : ['#4f7a4a', '#16241a'],
      destaque: p.destaque,
      imagem: p.foto_url || '',
    }))
  )
}