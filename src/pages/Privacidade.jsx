import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { EMAIL_CONTATO, NOME_LOJA, POLITICA_ATUALIZADA_EM, RESPONSAVEL } from '../config'

export default function Privacidade() {
  return (
    <section className="relative px-6 pb-24 pt-32">
      <motion.article
        className="mx-auto max-w-3xl rounded-sm border border-linha bg-ameixa/30 p-6 sm:p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 text-ouro-claro">
          <Lock className="h-6 w-6" />
          <h1 className="font-elegante text-3xl sm:text-4xl">Política de Privacidade</h1>
        </div>
        <p className="mt-6 font-texto text-sm text-creme/70">Atualizada em {POLITICA_ATUALIZADA_EM}.</p>

        <div className="mt-8 space-y-6 font-elegante text-lg leading-relaxed text-creme/85">
          <p>Esta política explica como {NOME_LOJA}{RESPONSAVEL ? `, responsável por ${RESPONSAVEL},` : ''} utiliza os dados informados ao navegar e realizar pedidos.</p>
          <p>Coletamos nome, e-mail, WhatsApp e endereço de entrega para criar sua conta, processar pedidos, calcular a entrega e entrar em contato sobre a compra.</p>
          <p>Os dados são usados apenas para prestar o serviço solicitado e não são vendidos a terceiros. Serviços de hospedagem e pagamento podem processar dados conforme suas próprias políticas.</p>
          <p>Você pode pedir acesso, correção ou exclusão dos seus dados por meio do contato informado nesta página{EMAIL_CONTATO ? ': ' : '.'}{EMAIL_CONTATO && <strong className="text-ouro-claro"> {EMAIL_CONTATO}</strong>}</p>
          <p>Ao utilizar o site e aceitar esta política, você autoriza o tratamento dos dados necessários para concluir seu pedido.</p>
        </div>

        <Link to="/" className="mt-10 inline-block rounded-full border border-ouro px-8 py-3 font-texto text-xs font-semibold uppercase tracking-widest text-ouro-claro">
          Voltar para a loja
        </Link>
      </motion.article>
    </section>
  )
}