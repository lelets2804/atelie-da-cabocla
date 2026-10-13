import Hero from '../components/Hero'
import Destaques from '../components/Destaques'
import Sobre from '../components/Sobre'
import ConviteCadastro from '../components/ConviteCadastro'
import { usuarioAtual } from '../services/auth'

export default function Home({ onAdicionar }) {
  const usuario = usuarioAtual()

  return (
    <>
      <Hero />

      {usuario ? (
        <Destaques onAdicionar={onAdicionar} />
      ) : (
        <section id="colecao" className="scroll-mt-20 px-6 py-24">
          <ConviteCadastro
            titulo="Nossa coleção espera por você"
            texto="Crie sua conta gratuita ou entre para conhecer as peças e fazer o seu pedido."
          />
        </section>
      )}

      <Sobre />
    </>
  )
}