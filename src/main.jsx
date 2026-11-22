import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.jsx'
import { iniciarSessao } from './services/auth'
import { carregarCatalogo } from './data/produtos'

// Antes de mostrar o site: descobre quem está logada e carrega o catálogo do banco
Promise.all([
  iniciarSessao(),
  carregarCatalogo().catch((erro) => console.error('Não foi possível carregar o catálogo:', erro)),
]).finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        {/* Respeita quem pediu menos animação no sistema */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </BrowserRouter>
    </StrictMode>
  )
})