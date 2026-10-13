import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import PedidoPersonalizado from './PedidoPersonalizado'

// TROQUE PELOS DADOS REAIS DA LOJA
const WHATSAPP = '5511900000000' // só números: 55 + DDD + número
const INSTAGRAM = 'seu_instagram' // sem o @

export default function Rodape() {
  const linkWhats = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    'Olá! Vim pelo site do Ateliê da Cabocla.'
  )}`

  return (
    <footer
      id="contato"
      className="relative scroll-mt-20 overflow-hidden border-t border-ouro/20 bg-gradient-to-b from-noite to-black px-6 pb-10 pt-24"
    >
      <motion.div
        className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-ouro/10 blur-3xl"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.h2
          className="bg-gradient-to-b from-ouro-claro to-ouro bg-clip-text font-titulo text-4xl font-bold text-transparent sm:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Fale com a gente
        </motion.h2>
        <p className="mt-4 font-elegante text-xl text-creme/80">
          Dúvidas ou encomendas? Chame no WhatsApp ou peça sua peça personalizada abaixo.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href={linkWhats}
            target="_blank"
            rel="noreferrer"
            className="relative rounded-full bg-gradient-to-r from-ouro to-ouro-claro px-10 py-4 font-titulo text-sm font-bold tracking-widest text-noite"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(212,162,76,0.6)',
                '0 0 0 22px rgba(212,162,76,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
          >
            CHAMAR NO WHATSAPP
          </motion.a>

          <motion.a
            href={`https://instagram.com/${INSTAGRAM}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ouro px-10 py-4 font-titulo text-sm tracking-widest text-ouro-claro"
            whileHover={{ scale: 1.06, backgroundColor: 'rgba(212,162,76,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            INSTAGRAM
          </motion.a>
        </div>

        {/* Único lugar do pedido personalizado (mostra o formulário ou o convite de login) */}
        <div className="mt-16">
          <PedidoPersonalizado />
        </div>

        <div className="mt-16 flex items-center justify-center gap-3">
          <motion.span
            className="text-ouro"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-5 w-5" />
          </motion.span>
          <span className="font-titulo text-sm tracking-widest text-ouro-claro">
            Ateliê da Cabocla
          </span>
        </div>
        <p className="mt-3 font-texto text-xs text-creme/50">
          © {new Date().getFullYear()} Ateliê da Cabocla. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}