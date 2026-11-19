import Hero from '../components/Hero'
import Faixa from '../components/Faixa'
import Destaques from '../components/Destaques'
import Sobre from '../components/Sobre'
import ConviteCadastro from '../components/ConviteCadastro'
import TituloSecao from '../components/TituloSecao'
import { usuarioAtual } from '../services/auth'

export default function Home({ onAdicionar }) {
  const usuario = usuarioAtual()

  return (
    <>
      <Hero />
      <Faixa />

      {usuario ? (
        <Destaques onAdicionar={onAdicionar} />
      ) : (
        <section id="colecao" className="scroll-mt-20 px-6 py-28 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <TituloSecao numero="01" rotulo="Coleção" className="mb-14">
              Nossa coleção <em className="text-ouro-claro">espera por você</em>
            </TituloSecao>
            <ConviteCadastro
              titulo="Entre para ver as peças"
              texto="Crie sua conta gratuita ou entre para conhecer a coleção e fazer o seu pedido."
            />
          </div>
        </section>
      )}

      <Sobre />
    </>
  )
}