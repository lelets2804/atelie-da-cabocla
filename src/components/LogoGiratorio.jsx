// Marca do ateliê: um fio de contas fechado em círculo, com a firma embaixo.
// (O nome do arquivo ficou o mesmo para não quebrar quem já usa.)
export default function LogoGiratorio({ className = 'h-8 w-8' }) {
  const contas = Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2 + Math.PI / 2
    return { x: 50 + 34 * Math.cos(a), y: 50 + 34 * Math.sin(a), i }
  })

  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="34" stroke="#c4a06a" strokeOpacity="0.35" strokeWidth="1" />
      {contas.map(({ x, y, i }) =>
        i === 0 ? null : (
          <circle key={i} cx={x} cy={y} r={i % 6 === 0 ? 4.4 : 3.4} fill={i % 6 === 0 ? '#e3cfa6' : '#c4a06a'} />
        )
      )}
      <ellipse cx="50" cy="86" rx="5" ry="8" fill="#e3cfa6" />
    </svg>
  )
}