const PALAVRAS = ['Guias', 'Brajás', 'Pulseiras', 'Peças personalizadas', 'Feito à mão', 'Com fé e respeito']

// Faixa de texto passando devagar entre as seções
export default function Faixa() {
  const lista = [...PALAVRAS, ...PALAVRAS]

  return (
    <div className="overflow-hidden border-y border-linha py-6" aria-hidden="true">
      <div className="flex w-max animate-faixa">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center">
            {lista.map((palavra, i) => (
              <span key={`${copia}-${i}`} className="flex items-center font-elegante text-3xl italic text-creme/70 sm:text-4xl">
                <span className="px-8">{palavra}</span>
                <span className="h-2 w-2 rounded-full bg-ouro/70" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}