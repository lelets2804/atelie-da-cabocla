import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import PedidoPersonalizado from './PedidoPersonalizado'
import LogoGiratorio from './LogoGiratorio'
import TituloSecao from './TituloSecao'

import { WHATSAPP, INSTAGRAM } from '../config'

const SUAVE = [0.22, 1, 0.36, 1]

const NAVEGACAO = [
  { nome: 'Início', to: '/' },
  { nome: 'Produtos', to: '/produtos' },
  { nome: 'Sobre', to: '/#sobre' },
  { nome: 'Minha conta', to: '/conta' },
]

export default function Rodape() {
  const linkWhats = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site do Ateliê da Cabocla.')}`
  const linkInsta = `https://instagram.com/${INSTAGRAM}`

  return (
    <footer id="contato" className="relative scroll-mt-20 overflow-hidden border-t border-linha bg-[#0a100c]">
      {/* Contato + pedido personalizado */}
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-12 lg:gap-12 lg:py-36">
        <div className="lg:col-span-5">
          <TituloSecao numero="03" rotulo="Contato">
            Vamos criar a <em className="text-ouro-claro">sua peça?</em>
          </TituloSecao>

          <motion.p
            className="mt-8 max-w-md font-texto text-base leading-relaxed text-creme/60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: SUAVE }}
          >
            Dúvidas ou encomendas? Chame no WhatsApp ou descreva a peça que você imagina no formulário.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-px border border-linha bg-linha sm:max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: SUAVE, delay: 0.1 }}
          >
            {[
              { nome: 'WhatsApp', detalhe: 'Resposta mais rápida', href: linkWhats },
              { nome: 'Instagram', detalhe: `@${INSTAGRAM}`, href: linkInsta },
            ].map((c) => (
              <a key={c.nome} href={c.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between bg-[#0a100c] px-6 py-5 transition-colors hover:bg-musgo">
                <span>
                  <span className="block font-elegante text-2xl text-creme">{c.nome}</span>
                  <span className="font-texto text-xs text-creme/45">{c.detalhe}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-ouro transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Único lugar do pedido personalizado (mostra o formulário ou o convite de login) */}
        <div className="lg:col-span-6 lg:col-start-7">
          <PedidoPersonalizado />
        </div>
      </div>

      {/* Marca grande + links */}
      <div className="border-t border-linha">
        <div className="mx-auto max-w-7xl px-6 pt-16">
          <div className="grid gap-10 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <LogoGiratorio className="h-9 w-9" />
              <p className="font-texto text-sm leading-relaxed text-creme/50">
                Artigos religiosos feitos à mão,
                <br />
                com fé e respeito à tradição.
              </p>
            </div>
            <div>
              <p className="font-texto text-[11px] uppercase tracking-[0.24em] text-creme/35">Navegação</p>
              <ul className="mt-4 space-y-2">
                {NAVEGACAO.map((l) => (
                  <li key={l.nome}>
                    <Link to={l.to} className="font-texto text-sm text-creme/70 transition-colors hover:text-creme">{l.nome}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-texto text-[11px] uppercase tracking-[0.24em] text-creme/35">Contato</p>
              <ul className="mt-4 space-y-2">
                <li><a href={linkWhats} target="_blank" rel="noreferrer" className="font-texto text-sm text-creme/70 transition-colors hover:text-creme">WhatsApp</a></li>
                <li><a href={linkInsta} target="_blank" rel="noreferrer" className="font-texto text-sm text-creme/70 transition-colors hover:text-creme">Instagram</a></li>
              </ul>
            </div>
          </div>

          <motion.p
            className="mt-16 select-none whitespace-nowrap text-center font-elegante text-[13.5vw] font-medium leading-[0.8] tracking-[-0.03em] text-creme/6 lg:text-[11.2rem]"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: SUAVE }}
            aria-hidden="true"
          >
            Ateliê da Cabocla
          </motion.p>
        </div>
        <div className="border-t border-linha">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 py-6 font-texto text-xs text-creme/35">
            <p>© {new Date().getFullYear()} Ateliê da Cabocla. Todos os direitos reservados.</p>
            <Link to="/privacidade" className="transition-colors hover:text-creme/70">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}