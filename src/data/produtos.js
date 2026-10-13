// Catálogo da loja.
// TEMPORÁRIO: as alterações feitas no painel ficam salvas só neste navegador.
// Quando o backend estiver pronto, estes dados passam a vir da API.

const CHAVE = 'catalogo'

const PADRAO = {
  // Tipos de produto
  tipos: ['Guias', 'Brajás', 'Pulseiras', 'Personalizados'],

  // Linhas e suas divisões
  linhas: {
    Orixás: ['Iemanjá', 'Ogum', 'Oxóssi', 'Xangô', 'Omolu', 'Oxalá', 'Iansã'],
    Entidades: [
      'Caboclo',
      'Boiadeiro',
      'Baiano',
      'Erê',
      'Preto-Velho',
      'Pombogira',
      'Exu',
      'Malandro',
      'Cigano',
      'Marinheiro',
    ],
  },

  // Produtos de exemplo
  // destaque: true  ->  aparece na página inicial
  produtos: [
    { id: 1, nome: 'Guia de Iemanjá', tipo: 'Guias', linha: 'Orixás', divisao: 'Iemanjá', preco: 89.9, simbolo: '📿', cores: ['#4a8fc1', '#1a0b2e'], destaque: true },
    { id: 2, nome: 'Brajá de Ogum', tipo: 'Brajás', linha: 'Orixás', divisao: 'Ogum', preco: 119.9, simbolo: '⚔️', cores: ['#2b4fa1', '#3d1a54'], destaque: true },
    { id: 3, nome: 'Pulseira de Oxóssi', tipo: 'Pulseiras', linha: 'Orixás', divisao: 'Oxóssi', preco: 39.9, simbolo: '🏹', cores: ['#3f6b4f', '#1a0b2e'], destaque: false },
    { id: 4, nome: 'Taça de Xangô', tipo: 'Personalizados', linha: 'Orixás', divisao: 'Xangô', preco: 79.9, simbolo: '🏆', cores: ['#b5533c', '#3d1a54'], destaque: true },
    { id: 5, nome: 'Guia de Oxalá', tipo: 'Guias', linha: 'Orixás', divisao: 'Oxalá', preco: 94.9, simbolo: '🕊️', cores: ['#e8dfc8', '#6b2d8f'], destaque: false },
    { id: 6, nome: 'Guia de Iansã', tipo: 'Guias', linha: 'Orixás', divisao: 'Iansã', preco: 89.9, simbolo: '⚡', cores: ['#b5533c', '#d4a24c'], destaque: false },
    { id: 7, nome: 'Guia de Caboclo', tipo: 'Guias', linha: 'Entidades', divisao: 'Caboclo', preco: 84.9, simbolo: '🪶', cores: ['#3f6b4f', '#6b2d8f'], destaque: true },
    { id: 8, nome: 'Chapéu de Boiadeiro', tipo: 'Personalizados', linha: 'Entidades', divisao: 'Boiadeiro', preco: 99.9, simbolo: '🤠', cores: ['#8a5a2b', '#1a0b2e'], destaque: false },
    { id: 9, nome: 'Pulseira de Preto-Velho', tipo: 'Pulseiras', linha: 'Entidades', divisao: 'Preto-Velho', preco: 34.9, simbolo: '🌑', cores: ['#2a2a2a', '#d4a24c'], destaque: false },
    { id: 10, nome: 'Copo de Pombogira', tipo: 'Personalizados', linha: 'Entidades', divisao: 'Pombogira', preco: 49.9, simbolo: '🥂', cores: ['#8f1f3a', '#1a0b2e'], destaque: true },
    { id: 11, nome: 'Brajá de Exu', tipo: 'Brajás', linha: 'Entidades', divisao: 'Exu', preco: 109.9, simbolo: '🔱', cores: ['#8f1f3a', '#1a0b2e'], destaque: false },
    { id: 12, nome: 'Guia de Cigano', tipo: 'Guias', linha: 'Entidades', divisao: 'Cigano', preco: 89.9, simbolo: '🔮', cores: ['#6b2d8f', '#d4a24c'], destaque: false },
  ],
}

function ler() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE))
    if (salvo && salvo.produtos && salvo.tipos && salvo.linhas) return salvo
  } catch {
    // ignora e usa o padrão
  }
  return PADRAO
}

const inicial = ler()

// Estas listas são alteradas "no lugar" pelo painel (veja services/catalogo.js),
// por isso a loja sempre enxerga a versão mais recente.
export const TIPOS = inicial.tipos
export const LINHAS = inicial.linhas
export const PRODUTOS = inicial.produtos

export function salvarCatalogo() {
  localStorage.setItem(CHAVE, JSON.stringify({ tipos: TIPOS, linhas: LINHAS, produtos: PRODUTOS }))
}