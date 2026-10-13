import { motion } from 'framer-motion'
import MandalaIcone from './MandalaIcone'

const TAMANHOS = {
  'text-9xl': 'h-32 w-32',
  'text-7xl': 'h-20 w-20',
  'text-6xl': 'h-16 w-16',
}

// Mostra a foto do produto; se não tiver foto, mostra a mandala.
// O elemento de fora precisa ter a classe "group" e posição relativa.
export default function ArteProduto({ produto, tamanho = 'text-7xl' }) {
  if (produto.imagem) {
    return <img src={produto.imagem} alt={produto.nome} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
  }

  return (
    <motion.span className="relative drop-shadow-lg" animate={{ y: [0, -12, 0], rotate: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
      <MandalaIcone className={TAMANHOS[tamanho] || 'h-20 w-20'} />
    </motion.span>
  )
}