import { motion } from 'framer-motion'

// Mostra a foto do produto; se não tiver foto, mostra o símbolo provisório.
// O elemento de fora precisa ter a classe "group" e posição relativa.
export default function ArteProduto({ produto, tamanho = 'text-7xl' }) {
  if (produto.imagem) {
    return (
      <img
        src={produto.imagem}
        alt={produto.nome}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    )
  }

  return (
    <motion.span
      className={`relative drop-shadow-lg ${tamanho}`}
      animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {produto.simbolo}
    </motion.span>
  )
}