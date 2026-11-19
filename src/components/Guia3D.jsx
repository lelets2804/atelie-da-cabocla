import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Guia em 3D feita a partir da peça do ateliê: cristais lapidados azul-claro e
// verde-escuro, trechos de madeira verde com discos bege, flores brancas,
// uma semente pintada e o pingente com pena de pavão.

const CORES = {
  turquesa: '#36bde6',
  verdeEscuro: '#0b4a30',
  lima: '#a3d65a',
  madeira: '#5cbf63',
  disco: '#dcb77c',
  flor: '#f4f3ee',
  prata: '#c9ccd1',
  vermelho: '#c62a2f',
  amarelo: '#ecbc1f',
  verde: '#2f9a3f',
}

// Quanto cada conta ocupa ao longo do fio
const COMPRIMENTO = { cristal: 0.096, madeira: 0.14, disco: 0.04, flor: 0.15, semente: 0.27 }
const FOLGA = 0.006

// Número "aleatório" que é sempre o mesmo para o mesmo i (o desenho não muda a cada abertura)
function aleatorio(i) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// Ordem das contas, repetida ao longo do fio (igual à foto)
function criarSequencia() {
  const cristais = (n, inicio) =>
    Array.from({ length: n }, (_, i) => ['cristal', (i + inicio) % 9 === 4 ? 'lima' : i % 2 === 0 ? 'turquesa' : 'verdeEscuro'])
  const madeira = () => [
    ['disco', 'disco'], ['madeira', 'madeira'], ['disco', 'disco'], ['madeira', 'madeira'],
    ['disco', 'disco'], ['madeira', 'madeira'], ['disco', 'disco'], ['madeira', 'madeira'], ['disco', 'disco'],
  ]
  const flor = [['flor', 'flor']]
  return [...cristais(12, 0), ...flor, ...cristais(10, 3), ...madeira(), ...flor]
}

// Caminho do colar: um laço comprido que desce em "V" na frente, onde fica o pingente
function criarCaminho() {
  const pontos = []
  for (let i = 0; i < 240; i++) {
    const t = (i / 240) * Math.PI * 2
    const frente = Math.max(0, Math.cos(t)) ** 8
    pontos.push(new THREE.Vector3(1.05 * Math.sin(t) * (1 - 0.25 * frente), -1.4 * Math.cos(t) - 0.3 * frente, 0.55 * Math.cos(t)))
  }
  return new THREE.CatmullRomCurve3(pontos, true, 'catmullrom', 0.5)
}

// Distribui as contas pelo fio, cada uma virada na direção do fio
function montarContas(caminho) {
  const total = caminho.getLength()
  const sequencia = criarSequencia()
  const grupos = { cristal: [], madeira: [], disco: [], flor: [] }
  let semente = null
  const eixoY = new THREE.Vector3(0, 1, 0)
  const vaoPingente = 0.1 / total

  let u = vaoPingente
  let i = 0
  while (u < 1 - vaoPingente) {
    // A semente fica do lado esquerdo, mais para baixo (como na foto)
    let [tipo, cor] = sequencia[i % sequencia.length]
    if (!semente && u > 0.62) tipo = 'semente'

    const comp = COMPRIMENTO[tipo] / total
    const meio = u + comp / 2
    if (meio > 1 - vaoPingente) break

    const posicao = caminho.getPointAt(meio)
    const direcao = caminho.getTangentAt(meio)
    const giro = new THREE.Quaternion().setFromUnitVectors(eixoY, direcao)

    if (tipo === 'semente') semente = { posicao, giro }
    else grupos[tipo].push({ posicao, giro, cor: CORES[cor], i })

    u += comp + FOLGA / total
    if (tipo !== 'semente') i++
  }
  return { grupos, semente }
}

// Textura da semente: bege com pintinhas marrons
function criarTexturaSemente() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#dcc9a4'
  g.fillRect(0, 0, 256, 128)
  for (let i = 0; i < 260; i++) {
    g.fillStyle = aleatorio(i) > 0.7 ? '#5b3a1f' : '#8a6238'
    g.globalAlpha = 0.5 + aleatorio(i + 1) * 0.5
    g.beginPath()
    g.ellipse(aleatorio(i + 2) * 256, aleatorio(i + 3) * 128, 1 + aleatorio(i + 4) * 4, 1 + aleatorio(i + 5) * 2.5, aleatorio(i + 6) * 3, 0, Math.PI * 2)
    g.fill()
  }
  const textura = new THREE.CanvasTexture(c)
  textura.colorSpace = THREE.SRGBColorSpace
  return textura
}

// Textura da pena de pavão, desenhada na hora (fundo transparente)
function criarTexturaPena() {
  const w = 512
  const h = 1024
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  const cx = w / 2
  const olhoY = h * 0.22

  // Barbas: fios saindo da haste para os lados
  for (let y = 20; y < h - 8; y += 2.5) {
    const k = y / h
    const envelope = k < 0.25 ? Math.sin((k / 0.25) * (Math.PI / 2)) : Math.max(0.15, 1 - (k - 0.25) / 0.85)
    for (const lado of [-1, 1]) {
      const comp = envelope * w * 0.46 * (0.75 + 0.25 * aleatorio(y * 7 + lado))
      const perto = Math.abs(y - olhoY) < 230
      g.strokeStyle = perto
        ? aleatorio(y + lado) > 0.5 ? '#6f7a2c' : '#8a6a2d'
        : aleatorio(y * 3 + lado) > 0.5 ? '#6b4a2b' : '#7d5a33'
      g.globalAlpha = k > 0.5 ? 0.5 : 0.85
      g.lineWidth = 1.3
      g.beginPath()
      g.moveTo(cx, y)
      g.quadraticCurveTo(cx + lado * comp * 0.55, y + comp * 0.12, cx + lado * comp, y + comp * (0.35 + k * 0.5))
      g.stroke()
    }
  }

  // Olho da pena: anéis com degradê
  g.globalAlpha = 1
  const aneis = [
    [150, 188, '#9c7a35', '#c9a24c'],
    [133, 166, '#3f8f37', '#6fb84a'],
    [114, 141, '#1f9b93', '#45c3b4'],
    [98, 119, '#9b7b34', '#cfa955'],
    [86, 103, '#1f5fa0', '#3c8fd0'],
    [64, 78, '#0e1f58', '#1f3a8a'],
  ]
  aneis.forEach(([rx, ry, escura, clara]) => {
    const yc = olhoY + (188 - ry) * 0.35
    const grad = g.createRadialGradient(cx - rx * 0.25, yc - ry * 0.3, 0, cx, yc, Math.max(rx, ry))
    grad.addColorStop(0, clara)
    grad.addColorStop(1, escura)
    g.fillStyle = grad
    g.beginPath()
    g.ellipse(cx, yc, rx, ry, 0, 0, Math.PI * 2)
    g.fill()
  })

  // Fios finos por cima do olho, para parecer pena e não um desenho chapado
  for (let i = 0; i < 900; i++) {
    const ang = aleatorio(i) * Math.PI * 2
    const r = 20 + aleatorio(i + 1) * 170
    const x = cx + Math.cos(ang) * r * 0.8
    const y = olhoY + 40 + Math.sin(ang) * r
    g.strokeStyle = aleatorio(i + 2) > 0.5 ? 'rgba(255,240,200,0.10)' : 'rgba(0,0,0,0.14)'
    g.lineWidth = 1
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + Math.cos(ang) * 18, y + Math.sin(ang) * 18 + 6)
    g.stroke()
  }

  // Borda do olho desfiada
  for (let i = 0; i < 260; i++) {
    const ang = (i / 260) * Math.PI * 2
    const x = cx + Math.cos(ang) * 150
    const y = olhoY + Math.sin(ang) * 188
    g.strokeStyle = aleatorio(i + 50) > 0.5 ? 'rgba(201,162,76,0.7)' : 'rgba(111,122,44,0.7)'
    g.lineWidth = 1.2
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + Math.cos(ang) * (10 + aleatorio(i) * 22), y + Math.sin(ang) * (10 + aleatorio(i) * 22) + 8)
    g.stroke()
  }

  // Haste
  g.strokeStyle = '#e2d6b5'
  g.lineWidth = 5
  g.beginPath()
  g.moveTo(cx, olhoY + 60)
  g.lineTo(cx, h)
  g.stroke()

  const textura = new THREE.CanvasTexture(c)
  textura.colorSpace = THREE.SRGBColorSpace
  textura.anisotropy = 4
  return textura
}

// Um tipo de conta desenhado várias vezes de uma vez (bem mais leve)
function Contas({ itens, escala, girarAleatorio = false, coresPorConta = false, children }) {
  const ref = useRef()

  useEffect(() => {
    const m = new THREE.Matrix4()
    const extra = new THREE.Quaternion()
    const cor = new THREE.Color()
    itens.forEach(({ posicao, giro, cor: c, i }, n) => {
      let q = giro
      if (girarAleatorio) q = giro.clone().multiply(extra.setFromEuler(new THREE.Euler(0, aleatorio(i) * 6.28, aleatorio(i + 9) * 0.6)))
      m.compose(posicao, q, new THREE.Vector3(...escala))
      ref.current.setMatrixAt(n, m)
      if (coresPorConta) ref.current.setColorAt(n, cor.set(c))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (coresPorConta) ref.current.instanceColor.needsUpdate = true
  }, [itens, escala, girarAleatorio, coresPorConta])

  return (
    <instancedMesh ref={ref} args={[null, null, itens.length]}>
      {children}
    </instancedMesh>
  )
}

const ESCALA_CRISTAL = [0.068, 0.047, 0.068]
const ESCALA_MADEIRA = [0.074, 0.068, 0.074]
const ESCALA_DISCO = [0.062, 0.018, 0.062]
const ESCALA_FLOR = [0.086, 0.07, 0.07]

function Pingente({ posicao }) {
  const balanco = useRef()
  const pena = useRef()
  const texturaPena = useMemo(() => criarTexturaPena(), [])

  // Pena levemente curvada, para não parecer um papel chapado
  const formaPena = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.78, 1.65, 8, 24)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(i, 0.12 * (x / 0.39) ** 2 * 0.5 + 0.05 * Math.sin(y * 2))
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((estado) => {
    const t = estado.clock.elapsedTime
    if (balanco.current) {
      balanco.current.rotation.z = Math.sin(t * 1.1) * 0.07
      balanco.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.05
    }
    if (pena.current) pena.current.rotation.y = Math.sin(t * 0.9) * 0.18
  })

  // Contas do pingente, de cima para baixo
  const pecas = [
    { y: -0.07, tipo: 'madeira' },
    { y: -0.15, tipo: 'disco', cor: CORES.disco },
    { y: -0.23, tipo: 'madeira' },
    { y: -0.34, tipo: 'argola' },
    { y: -0.43, tipo: 'disco', cor: CORES.verde },
    { y: -0.465, tipo: 'disco', cor: CORES.amarelo },
    { y: -0.5, tipo: 'disco', cor: CORES.vermelho },
    { y: -0.535, tipo: 'disco', cor: CORES.verde },
  ]

  return (
    <group position={posicao}>
      <group ref={balanco}>
        {pecas.map((p, i) =>
          p.tipo === 'argola' ? (
            <mesh key={i} position={[0, p.y, 0]}>
              <torusGeometry args={[0.045, 0.012, 12, 32]} />
              <meshStandardMaterial color={CORES.prata} metalness={1} roughness={0.2} />
            </mesh>
          ) : p.tipo === 'madeira' ? (
            <mesh key={i} position={[0, p.y, 0]} scale={ESCALA_MADEIRA}>
              <sphereGeometry args={[1, 24, 18]} />
              <meshStandardMaterial color={CORES.madeira} roughness={0.55} />
            </mesh>
          ) : (
            <mesh key={i} position={[0, p.y, 0]} scale={[0.05, 0.016, 0.05]}>
              <cylinderGeometry args={[1, 1, 1, 24]} />
              <meshStandardMaterial color={p.cor} roughness={0.5} />
            </mesh>
          )
        )}

        {/* Haste da pena entrando nas contas */}
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.007, 0.009, 0.2, 8]} />
          <meshStandardMaterial color="#e2d6b5" roughness={0.6} />
        </mesh>

        <mesh ref={pena} geometry={formaPena} position={[0, -0.7 - 0.8, 0]}>
          <meshStandardMaterial map={texturaPena} transparent alphaTest={0.04} side={THREE.DoubleSide} roughness={0.45} metalness={0.35} />
        </mesh>
      </group>
    </group>
  )
}

function Colar({ mouse, parado }) {
  const grupo = useRef()
  const texturaSemente = useMemo(() => criarTexturaSemente(), [])

  const { caminho, grupos, semente } = useMemo(() => {
    const caminho = criarCaminho()
    return { caminho, ...montarContas(caminho) }
  }, [])

  const fio = useMemo(() => new THREE.TubeGeometry(caminho, 400, 0.006, 6, true), [caminho])
  const frente = useMemo(() => caminho.getPointAt(0), [caminho])

  useFrame((estado) => {
    const g = grupo.current
    if (!g) return
    const t = estado.clock.elapsedTime
    // Vai e volta devagar (assim a pena fica sempre de frente)
    const alvoY = (parado ? 0 : Math.sin(t * 0.35) * 0.55) + mouse.current.x * 0.35
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, alvoY, 0.04)
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.12 + mouse.current.y * 0.15, 0.05)
    g.position.y = 1.2 + (parado ? 0 : Math.sin(t * 0.8) * 0.05)
  })

  return (
    <group ref={grupo}>
      <mesh geometry={fio}>
        <meshStandardMaterial color="#e8e2d2" roughness={0.6} />
      </mesh>

      {/* Cristais lapidados: poucos lados + sombreamento chapado = facetas que brilham */}
      <Contas itens={grupos.cristal} escala={ESCALA_CRISTAL} coresPorConta>
        <sphereGeometry args={[1, 8, 4]} />
        <meshPhysicalMaterial flatShading roughness={0.04} metalness={0.1} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={1.8} />
      </Contas>

      <Contas itens={grupos.madeira} escala={ESCALA_MADEIRA}>
        <sphereGeometry args={[1, 24, 18]} />
        <meshStandardMaterial color={CORES.madeira} roughness={0.55} />
      </Contas>

      <Contas itens={grupos.disco} escala={ESCALA_DISCO}>
        <cylinderGeometry args={[1, 1, 1, 24]} />
        <meshStandardMaterial color={CORES.disco} roughness={0.6} />
      </Contas>

      {/* Flores brancas leitosas */}
      <Contas itens={grupos.flor} escala={ESCALA_FLOR} girarAleatorio>
        <dodecahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial flatShading color={CORES.flor} roughness={0.25} transmission={0.35} thickness={0.5} clearcoat={1} emissive="#2a2a28" />
      </Contas>

      {semente && (
        <mesh position={semente.posicao} quaternion={semente.giro} scale={[0.115, 0.135, 0.115]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial map={texturaSemente} roughness={0.5} />
        </mesh>
      )}

      <Pingente posicao={[frente.x, frente.y - 0.02, frente.z]} />
    </group>
  )
}

// Reflexos de estúdio, sem precisar baixar nenhuma imagem
function criarReflexos({ gl, scene }) {
  const pmrem = new THREE.PMREMGenerator(gl)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()
}

export default function Guia3D() {
  const caixa = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const [visivel, setVisivel] = useState(true)
  const [parado] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  // Segue o mouse na janela toda (não só em cima do desenho)
  useEffect(() => {
    function mover(e) {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', mover, { passive: true })
    return () => window.removeEventListener('pointermove', mover)
  }, [])

  // Pausa a animação quando o 3D sai da tela, para não gastar bateria
  useEffect(() => {
    const observador = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting))
    if (caixa.current) observador.observe(caixa.current)
    return () => observador.disconnect()
  }, [])

  return (
    <div ref={caixa} className="h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8.4], fov: 34 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        frameloop={visivel ? 'always' : 'never'}
        onCreated={criarReflexos}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} color="#fff3dc" />
        <directionalLight position={[-3, 1, 4]} intensity={0.6} color="#dff4ff" />
        <pointLight position={[-4, -2, 2]} intensity={5} color="#9bb59a" />
        <Colar mouse={mouse} parado={parado} />
      </Canvas>
    </div>
  )
}