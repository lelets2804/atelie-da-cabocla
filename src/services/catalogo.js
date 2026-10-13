import { PRODUTOS, TIPOS, LINHAS, salvarCatalogo } from '../data/produtos'

// TEMPORÁRIO: quando o backend estiver pronto, trocar por chamadas à API, por exemplo:
//   POST    URL_DA_API/produtos        (criar)
//   PUT     URL_DA_API/produtos/:id    (editar)
//   DELETE  URL_DA_API/produtos/:id    (excluir)
//   POST    URL_DA_API/produtos/:id/foto   (enviar a foto)
//   GET/POST/PUT/DELETE  URL_DA_API/tipos, /linhas e /linhas/:linha/divisoes

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

function gravar() {
  try {
    salvarCatalogo()
    return { ok: true }
  } catch {
    return {
      ok: false,
      erro: 'Não coube no armazenamento do navegador (isso vale só para o modo de teste).',
    }
  }
}

// Renomeia uma chave do objeto mantendo a ordem
function renomearChave(objeto, antiga, nova) {
  const entradas = Object.entries(objeto)
  entradas.forEach(([chave]) => delete objeto[chave])
  entradas.forEach(([chave, valor]) => {
    objeto[chave === antiga ? nova : chave] = valor
  })
}

function textoProdutos(n) {
  return `${n} ${n === 1 ? 'produto' : 'produtos'}`
}

/* ---------------------------- Produtos ---------------------------- */

// Cria o produto (sem id) ou atualiza o existente (com id)
// Devolve { ok: true } ou { ok: false, erro: '...' }
export function salvarProduto(dados) {
  const indice = PRODUTOS.findIndex((p) => p.id === dados.id)
  const anterior = indice >= 0 ? PRODUTOS[indice] : null

  if (anterior) {
    PRODUTOS[indice] = { ...anterior, ...dados }
  } else {
    PRODUTOS.unshift({ ...dados, id: Date.now() })
  }

  try {
    salvarCatalogo()
    return { ok: true }
  } catch {
    // Sem espaço no navegador: desfaz a alteração
    if (anterior) PRODUTOS[indice] = anterior
    else PRODUTOS.shift()
    return {
      ok: false,
      erro: 'Não coube no armazenamento do navegador. Use uma foto menor ou tire fotos de outros produtos (isso vale só para o modo de teste).',
    }
  }
}

export function excluirProduto(id) {
  const indice = PRODUTOS.findIndex((p) => p.id === id)
  if (indice >= 0) PRODUTOS.splice(indice, 1)
  salvarCatalogo()
}

export function alternarDestaque(id) {
  const produto = PRODUTOS.find((p) => p.id === id)
  if (produto) {
    produto.destaque = !produto.destaque
    salvarCatalogo()
  }
}

/* ------------------------------ Tipos ------------------------------ */

export function adicionarTipo(nome) {
  const erro = validar(nome, TIPOS)
  if (erro) return { ok: false, erro }
  TIPOS.push(nome.trim())
  return gravar()
}

export function renomearTipo(antigo, novo) {
  const erro = validar(novo, TIPOS, antigo)
  if (erro) return { ok: false, erro }

  const indice = TIPOS.indexOf(antigo)
  if (indice < 0) return { ok: false, erro: 'Item não encontrado.' }

  const nome = novo.trim()
  TIPOS[indice] = nome
  PRODUTOS.forEach((p) => {
    if (p.tipo === antigo) p.tipo = nome
  })
  return gravar()
}

export function removerTipo(nome) {
  const usados = PRODUTOS.filter((p) => p.tipo === nome).length
  if (usados > 0) {
    return {
      ok: false,
      erro: `Existem ${textoProdutos(usados)} do tipo "${nome}". Mude ou exclua essas peças antes de remover.`,
    }
  }
  const indice = TIPOS.indexOf(nome)
  if (indice >= 0) TIPOS.splice(indice, 1)
  return gravar()
}

/* ------------------------------ Linhas ----------------------------- */

export function adicionarLinha(nome) {
  const erro = validar(nome, Object.keys(LINHAS))
  if (erro) return { ok: false, erro }
  LINHAS[nome.trim()] = []
  return gravar()
}

export function renomearLinha(antiga, nova) {
  const erro = validar(nova, Object.keys(LINHAS), antiga)
  if (erro) return { ok: false, erro }
  if (!LINHAS[antiga]) return { ok: false, erro: 'Item não encontrado.' }

  const nome = nova.trim()
  renomearChave(LINHAS, antiga, nome)
  PRODUTOS.forEach((p) => {
    if (p.linha === antiga) p.linha = nome
  })
  return gravar()
}

export function removerLinha(nome) {
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
  delete LINHAS[nome]
  return gravar()
}

/* ---------------------------- Divisões ----------------------------- */

export function adicionarDivisao(linha, nome) {
  const lista = LINHAS[linha]
  if (!lista) return { ok: false, erro: 'Linha não encontrada.' }

  const erro = validar(nome, lista)
  if (erro) return { ok: false, erro }
  lista.push(nome.trim())
  return gravar()
}

export function renomearDivisao(linha, antiga, nova) {
  const lista = LINHAS[linha]
  if (!lista) return { ok: false, erro: 'Linha não encontrada.' }

  const erro = validar(nova, lista, antiga)
  if (erro) return { ok: false, erro }

  const indice = lista.indexOf(antiga)
  if (indice < 0) return { ok: false, erro: 'Item não encontrado.' }

  const nome = nova.trim()
  lista[indice] = nome
  PRODUTOS.forEach((p) => {
    if (p.linha === linha && p.divisao === antiga) p.divisao = nome
  })
  return gravar()
}

export function removerDivisao(linha, nome) {
  const lista = LINHAS[linha]
  if (!lista) return { ok: false, erro: 'Linha não encontrada.' }

  const usados = PRODUTOS.filter((p) => p.linha === linha && p.divisao === nome).length
  if (usados > 0) {
    return {
      ok: false,
      erro: `Existem ${textoProdutos(usados)} em "${nome}". Mude ou exclua essas peças antes de remover.`,
    }
  }
  const indice = lista.indexOf(nome)
  if (indice >= 0) lista.splice(indice, 1)
  return gravar()
}