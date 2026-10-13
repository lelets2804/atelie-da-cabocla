import { motion } from 'framer-motion'
import Colecao from '../components/Colecao'

export default function Produtos({ onAdicionar }) {
  return (
    <motion.div
      className="pt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Colecao onAdicionar={onAdicionar} />
    </motion.div>
  )
}