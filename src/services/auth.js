const CONTAS = 'contas'
const SESSAO = 'sessao'

// TEMPORÁRIO: as contas ficam salvas só neste navegador, com senha em texto puro.
// Quando o backend estiver pronto, trocar estas funções por chamadas à API
// (a senha deve ser guardada criptografada no servidor).

function lerContas() {
  let contas = []
  try {
    contas = JSON.parse(localStorage.getItem(CONTAS)) || []
  } catch {
    contas = []
  }

  // Conta da administradora para teste
  if (!contas.some((c) => c.papel === 'admin')) {
    contas.push({
      id: 1,
      nome: 'Administradora',
      email: 'admin@ateliedacabocla.com',
      senha: 'cabocla123',
      whatsapp: '',
      papel: 'admin',
    })
    localStorage.setItem(CONTAS, JSON.stringify(contas))
  }
  return contas
}

// Devolve a conta sem a senha
function publico(conta) {
  return {
    id: conta.id,
    nome: conta.nome,
    email: conta.email,
    whatsapp: conta.whatsapp,
    papel: conta.papel,
  }
}

export function criarConta({ nome, email, senha, whatsapp }) {
  const contas = lerContas()
  const emailLimpo = email.trim().toLowerCase()

  if (contas.some((c) => c.email === emailLimpo)) {
    return { ok: false, erro: 'Já existe uma conta com este e-mail. Tente entrar.' }
  }

  const conta = {
    id: Date.now(),
    nome,
    email: emailLimpo,
    senha,
    whatsapp,
    papel: 'cliente',
  }
  localStorage.setItem(CONTAS, JSON.stringify([...contas, conta]))
  localStorage.setItem(SESSAO, String(conta.id))
  return { ok: true, usuario: publico(conta) }
}

export function entrar(email, senha) {
  const emailLimpo = email.trim().toLowerCase()
  const conta = lerContas().find((c) => c.email === emailLimpo)

  if (!conta) {
    return {
      ok: false,
      erro: 'Não encontramos uma conta com este e-mail. Crie sua conta primeiro.',
    }
  }
  if (conta.senha !== senha) {
    return { ok: false, erro: 'Senha incorreta.' }
  }

  localStorage.setItem(SESSAO, String(conta.id))
  return { ok: true, usuario: publico(conta) }
}

export function sair() {
  localStorage.removeItem(SESSAO)
}

export function usuarioAtual() {
  const id = localStorage.getItem(SESSAO)
  if (!id) return null
  const conta = lerContas().find((c) => String(c.id) === id)
  return conta ? publico(conta) : null
}