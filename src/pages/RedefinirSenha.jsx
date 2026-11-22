import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check } from 'lucide-react'
import { definirNovaSenha, usuarioAtual } from '../services/auth'

const estiloCampo = 'w-full rounded-xl border border-ouro/30 bg-noite/70 py-3 pl-12 pr-4 font-texto text-sm text-creme placeholder:text-creme/40 outline-none transition focus:border-ouro focus:shadow-[0_0_20px_rgba(212,162,76,0.25)]'

// Página aberta pelo link do e-mail "Esqueci minha senha".
// O Supabase já deixa a pessoa logada ao abrir o link (veja iniciarSessao em main.jsx);
// se não houver ninguém logada, o link é inválido ou venceu.
export default function RedefinirSenha() {
  const navigate = useNavigate()
  const usuario = usuarioAtual()

  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [pronto, setPronto] = useState(false)

  async function aoEnviar(e) {
    e.preventDefault()
    setErro('')

    if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.')
    if (senha !== confirmar) return setErro('As senhas não conferem.')

    setEnviando(true)
    try {
      const resultado = await definirNovaSenha(senha)
      if (!resultado.ok) return setErro(resultado.erro)
      setPronto(true)
    } catch {
      setErro('Não foi possível conectar agora. Verifique sua internet e tente de novo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,var(--color-musgo),var(--color-noite)_70%)] px-6 pb-20 pt-32">
      <motion.div
        className="relative w-full max-w-md rounded-3xl border border-ouro/30 bg-noite/70 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {pronto ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-ouro text-ouro">
              <Check className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h1 className="mt-5 font-titulo text-2xl font-bold text-ouro-claro">Senha alterada!</h1>
            <p className="mt-2 font-elegante text-lg text-creme/70">Você já está dentro da sua conta.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite"
            >
              IR PARA A LOJA
            </button>
          </>
        ) : !usuario ? (
          <>
            <h1 className="font-titulo text-2xl font-bold text-ouro-claro">Link inválido ou vencido</h1>
            <p className="mt-3 font-elegante text-lg text-creme/70">
              Por segurança, o link para criar uma nova senha vale por pouco tempo e só pode ser usado uma vez.
            </p>
            <Link
              to="/entrar"
              state={{ modo: 'recuperar' }}
              className="mt-8 inline-block w-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite"
            >
              PEDIR UM NOVO LINK
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-titulo text-2xl font-bold text-ouro-claro">Nova senha</h1>
            <p className="mt-1 font-elegante text-lg text-creme/70">Escolha a senha para a conta {usuario.email}</p>

            <form onSubmit={aoEnviar} className="mt-6 space-y-4 text-left">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ouro/70" />
                <input
                  className={estiloCampo}
                  type="password"
                  placeholder="Nova senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ouro/70" />
                <input
                  className={estiloCampo}
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <AnimatePresence>
                {erro && (
                  <motion.p
                    className="text-center font-texto text-sm text-terracota"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {erro}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={enviando}
                className="w-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro py-4 font-titulo text-sm font-bold tracking-widest text-noite disabled:opacity-60"
                whileTap={{ scale: 0.97 }}
              >
                {enviando ? 'AGUARDE...' : 'SALVAR NOVA SENHA'}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
    </section>
  )
}