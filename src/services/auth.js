import { supabase } from '../lib/supabase'

// Guarda a pessoa logada na memória para o resto do site ler de forma simples
let usuario = null

async function carregarUsuario(user) {
  if (!user) return null

  const { data } = await supabase
    .from('perfis')
    .select('nome, whatsapp, papel')
    .eq('id', user.id)
    .maybeSingle()

  return {
    id: user.id,
    email: user.email,
    nome: data?.nome || user.user_metadata?.nome || '',
    whatsapp: data?.whatsapp || user.user_metadata?.whatsapp || '',
    papel: data?.papel || 'cliente',
  }
}

// Chamada uma vez, antes de o site abrir (veja main.jsx)
export async function iniciarSessao() {
  try {
    const { data } = await supabase.auth.getSession()
    usuario = await carregarUsuario(data.session?.user)
  } catch {
    usuario = null
  }
}

function traduzirErro(erro) {
  console.error('Erro do Supabase:', erro)
  const mensagem = (erro?.message || '').toLowerCase()

  if (mensagem.includes('already registered') || mensagem.includes('already been registered')) {
    return 'Já existe uma conta com este e-mail. Tente entrar.'
  }
  if (mensagem.includes('invalid login credentials')) {
    return 'E-mail ou senha incorretos.'
  }
  if (mensagem.includes('email not confirmed')) {
    return 'Confirme seu e-mail antes de entrar. Procure a mensagem na sua caixa de entrada.'
  }
  if (mensagem.includes('rate limit') || mensagem.includes('too many') || mensagem.includes('security purposes')) {
    return 'Muitas tentativas. Espere um minutinho e tente de novo.'
  }
  if (mensagem.includes('different from the old password')) {
    return 'A nova senha precisa ser diferente da senha atual.'
  }
  if (mensagem.includes('at least') && mensagem.includes('characters')) {
    return 'A senha precisa ter pelo menos 6 caracteres.'
  }
  if (mensagem.includes('session') && mensagem.includes('missing')) {
    return 'O link expirou. Peça um novo em "Esqueci minha senha".'
  }
  return `Erro: ${erro?.message || 'não foi possível concluir agora.'}`
}

export async function criarConta({ nome, email, senha, whatsapp }) {
  const emailLimpo = email.trim().toLowerCase()

  const { data, error } = await supabase.auth.signUp({
    email: emailLimpo,
    password: senha,
    options: {
      data: { nome, whatsapp },
      // O link do e-mail de confirmação volta para o mesmo site onde a conta foi criada
      emailRedirectTo: window.location.origin,
    },
  })

  if (error) return { ok: false, erro: traduzirErro(error) }

  // Com a confirmação de e-mail ligada, o Supabase não dá erro quando o e-mail já existe:
  // devolve um usuário "vazio" (sem identidades). Avisamos para a pessoa entrar.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { ok: false, erro: 'Já existe uma conta com este e-mail. Tente entrar.' }
  }

  let user = data.user

  // Sem sessão: tenta entrar em seguida (funciona quando a conta já nasce confirmada)
  if (!data.session) {
    const login = await supabase.auth.signInWithPassword({ email: emailLimpo, password: senha })
    if (login.error) {
      return {
        ok: false,
        erro: 'Conta criada! Enviamos um e-mail para você confirmar e depois é só entrar.',
      }
    }
    user = login.data.user
  }

  usuario = await carregarUsuario(user)
  return { ok: true, usuario }
}

export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  })

  if (error) return { ok: false, erro: traduzirErro(error) }

  usuario = await carregarUsuario(data.user)
  return { ok: true, usuario }
}

export function sair() {
  usuario = null
  supabase.auth.signOut()
}

export function usuarioAtual() {
  return usuario
}

// "Esqueci minha senha": manda um e-mail com um link que abre /redefinir-senha
export async function pedirRecuperacaoDeSenha(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  })
  if (error) return { ok: false, erro: traduzirErro(error) }
  // Por segurança a resposta é sempre a mesma, exista ou não uma conta com esse e-mail
  return { ok: true }
}

// Usada na página /redefinir-senha: a pessoa já chegou logada pelo link do e-mail
export async function definirNovaSenha(senha) {
  const { error } = await supabase.auth.updateUser({ password: senha })
  if (error) return { ok: false, erro: traduzirErro(error) }
  return { ok: true }
}
