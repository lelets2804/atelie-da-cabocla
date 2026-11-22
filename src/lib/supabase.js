import { createClient } from '@supabase/supabase-js'

const urlBruta = import.meta.env.VITE_SUPABASE_URL
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!urlBruta || !chave) {
  throw new Error(
    'Faltam VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env.local (e reinicie o npm run dev).'
  )
}

// Usa só o endereço base (https://xxxx.supabase.co), ignorando barras ou caminhos a mais
const url = new URL(urlBruta.trim()).origin

export const supabase = createClient(url, chave.trim())