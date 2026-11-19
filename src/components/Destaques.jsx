import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PRODUTOS } from '../data/produtos'
import CardProduto from './CardProduto'
import TituloSecao from './TituloSecao'

export default function Destaques({ onAdicionar }) {
  const marcados = PRODUTOS.filter((p) => p.destaque)
  const destaques = (marcados.length ? marcados : PRODUTOS).slice(0, 5)

  return (
    <section id="colecao" className="relative scroll-mt-20 px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <TituloSecao numero="01" rotulo="Coleção">
            Peças em <em className="text-ouro-claro">destaque</em>
          </TituloSecao>

          <Link
            to="/produtos"
            className="group inline-flex items-center gap-3 self-start font-texto text-xs font-semibold uppercase tracking-[0.2em] text-creme/75 transition-colors hover:text-creme md:self-auto"
          >
            Ver todos os produtos
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-creme/25 transition-colors duration-300 group-hover:border-ouro group-hover:bg-ouro group-hover:text-noite">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {destaques.length === 0 ? (
          <p className="border-t border-linha py-16 font-elegante text-2xl italic text-creme/60">
            As primeiras peças estão sendo preparadas. Volte em breve.
          </p>
        ) : (
          <>
            {/* Mosaico (computador) / carrossel (celular) */}
            <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-4 scrollbar-none [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-0 lg:pb-0">
              {destaques.map((produto, i) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  indice={i}
                  grande={i === 0}
                  selo={produto.destaque ? 'Destaque' : undefined}
                  onAdicionar={onAdicionar}
                  className={`w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-auto ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                />
              ))}
            </div>
            <p className="mt-4 font-texto text-[11px] uppercase tracking-[0.2em] text-creme/35 lg:hidden">Deslize para ver mais →</p>
          </>
        )}
      </div>
    </section>
  )
}