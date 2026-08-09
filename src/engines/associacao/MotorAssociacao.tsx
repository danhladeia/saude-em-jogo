import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { ConteudoAssociacao } from '@/content/schemas'
import type { PropsDeMotor } from '../tipos'
import { Enunciado } from '../comuns/Enunciado'
import { Figura } from '../comuns/Figura'
import { Botao } from '@/design/Botao'
import { celebrarAcerto } from '@/design/celebrar'
import { narrar } from '@/lib/narracao'
import { usarPerfil } from '@/store/usarPerfil'
import { cn } from '@/design/cn'
import { embaralhar } from '@/lib/sorte'

/**
 * Motor de associação — dois modos, um código:
 *  - 'ligar'   → "Corpo que fala" (gesto ⇄ significado)
 *  - 'memoria' → "Jogo da memória" dos esportes
 */
export function MotorAssociacao(props: PropsDeMotor<ConteudoAssociacao>) {
  return props.conteudo.modo === 'memoria' ? <Memoria {...props} /> : <Ligar {...props} />
}

/* ------------------------------------------------------------------ *
 * Modo LIGAR
 * ------------------------------------------------------------------ */
function Ligar({ conteudo, aoConcluir }: PropsDeMotor<ConteudoAssociacao>) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  // Embaralhar só a coluna da direita: a esquerda fica estável para a
  // criança não perder a referência do que já leu.
  const direita = useMemo(() => embaralhar(conteudo.pares), [conteudo.pares])

  const [selecionado, setSelecionado] = useState<string | null>(null)
  const [ligados, setLigados] = useState<Set<string>>(new Set())
  const [erros, setErros] = useState(0)
  const [recusado, setRecusado] = useState<string | null>(null)

  const terminou = ligados.size === conteudo.pares.length

  function escolherDireita(parId: string) {
    if (!selecionado || ligados.has(parId)) return

    if (selecionado === parId) {
      const proximos = new Set(ligados).add(parId)
      setLigados(proximos)
      setSelecionado(null)
      celebrarAcerto()
      const par = conteudo.pares.find((p) => p.id === parId)
      if (narracaoLigada && par) narrar(par.explicacao ?? `${par.esquerda.rotulo}: ${par.direita.rotulo}`)
    } else {
      setErros((n) => n + 1)
      setRecusado(parId)
      setTimeout(() => setRecusado(null), 500)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Enunciado texto={conteudo.instrucao} chave={conteudo.id} />

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <ul className="flex flex-col gap-3">
          {conteudo.pares.map((par) => {
            const feito = ligados.has(par.id)
            return (
              <li key={par.id}>
                <button
                  type="button"
                  disabled={feito}
                  onClick={() => {
                    setSelecionado(par.id)
                    if (narracaoLigada) narrar(par.esquerda.rotulo)
                  }}
                  aria-pressed={selecionado === par.id}
                  className={cn(
                    'flex min-h-toque w-full items-center justify-center rounded-bolha border-4 bg-white p-3 transition-all',
                    feito && 'border-folha-400 bg-folha-100 opacity-60',
                    !feito && selecionado === par.id && 'border-ceu-400 ring-4 ring-ceu-200',
                    !feito && selecionado !== par.id && 'border-ceu-200 hover:border-ceu-300',
                  )}
                >
                  <Figura item={par.esquerda} />
                </button>
              </li>
            )
          })}
        </ul>

        <ul className="flex flex-col gap-3">
          {direita.map((par) => {
            const feito = ligados.has(par.id)
            return (
              <li key={par.id}>
                <motion.button
                  type="button"
                  disabled={feito || !selecionado}
                  onClick={() => escolherDireita(par.id)}
                  animate={recusado === par.id ? { x: [0, -8, 8, 0] } : { x: 0 }}
                  className={cn(
                    'flex min-h-toque w-full items-center justify-center rounded-bolha border-4 bg-white p-3 transition-all',
                    feito && 'border-folha-400 bg-folha-100 opacity-60',
                    !feito && recusado === par.id && 'border-coral-400',
                    !feito && recusado !== par.id && 'border-ceu-200 hover:border-ceu-300',
                    !selecionado && !feito && 'opacity-70',
                  )}
                >
                  <Figura item={par.direita} />
                </motion.button>
              </li>
            )
          })}
        </ul>
      </div>

      {!selecionado && !terminou && (
        <p className="text-center text-lg font-bold text-tinta-400">
          Toque primeiro em um item da esquerda.
        </p>
      )}

      {terminou && (
        <Botao
          cor="folha"
          tamanho="grande"
          largo
          onClick={() =>
            aoConcluir({
              acertos: Math.max(conteudo.pares.length - erros, 0),
              total: conteudo.pares.length,
            })
          }
        >
          Terminei!
        </Botao>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Modo MEMÓRIA
 * ------------------------------------------------------------------ */
interface Carta {
  chave: string
  parId: string
  lado: 'esquerda' | 'direita'
}

function Memoria({ conteudo, aoConcluir }: PropsDeMotor<ConteudoAssociacao>) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  const cartas = useMemo<Carta[]>(
    () =>
      embaralhar(
        conteudo.pares.flatMap((par) => [
          { chave: `${par.id}-e`, parId: par.id, lado: 'esquerda' as const },
          { chave: `${par.id}-d`, parId: par.id, lado: 'direita' as const },
        ]),
      ),
    [conteudo.pares],
  )

  const [viradas, setViradas] = useState<string[]>([])
  const [achados, setAchados] = useState<Set<string>>(new Set())
  const [tentativas, setTentativas] = useState(0)
  const [travado, setTravado] = useState(false)

  const terminou = achados.size === conteudo.pares.length

  function virar(carta: Carta) {
    if (travado || viradas.includes(carta.chave) || achados.has(carta.parId)) return

    const proximas = [...viradas, carta.chave]
    setViradas(proximas)

    if (proximas.length < 2) return

    setTentativas((n) => n + 1)
    const [a, b] = proximas.map((c) => cartas.find((x) => x.chave === c)!)

    if (a.parId === b.parId) {
      setAchados((s) => new Set(s).add(a.parId))
      setViradas([])
      celebrarAcerto()
      const par = conteudo.pares.find((p) => p.id === a.parId)
      if (narracaoLigada && par) narrar(par.explicacao ?? par.esquerda.rotulo)
    } else {
      setTravado(true)
      setTimeout(() => {
        setViradas([])
        setTravado(false)
      }, 900)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Enunciado texto={conteudo.instrucao} chave={conteudo.id} />

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {cartas.map((carta) => {
          const par = conteudo.pares.find((p) => p.id === carta.parId)!
          const item = carta.lado === 'esquerda' ? par.esquerda : par.direita
          const aberta = viradas.includes(carta.chave) || achados.has(carta.parId)

          return (
            <li key={carta.chave}>
              <button
                type="button"
                onClick={() => virar(carta)}
                aria-label={aberta ? item.rotulo : 'Carta virada para baixo'}
                className={cn(
                  'grid aspect-square w-full place-items-center rounded-bolha border-4 p-2 transition-all',
                  aberta
                    ? achados.has(carta.parId)
                      ? 'border-folha-400 bg-folha-100'
                      : 'border-ceu-400 bg-white'
                    : 'border-ceu-300 bg-ceu-200 hover:bg-ceu-300',
                )}
              >
                {aberta ? (
                  <Figura item={item} />
                ) : (
                  <span aria-hidden="true" className="text-4xl">
                    ❔
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {terminou && (
        <Botao
          cor="folha"
          tamanho="grande"
          largo
          onClick={() =>
            aoConcluir({
              // Pares achados sem repetir tentativa contam como acerto.
              acertos: Math.max(conteudo.pares.length * 2 - tentativas, 0),
              total: conteudo.pares.length,
            })
          }
        >
          Terminei!
        </Botao>
      )}
    </div>
  )
}
