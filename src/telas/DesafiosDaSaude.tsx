import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CHAVES, gravar, ler } from '@/lib/armazenamento'
import { hoje, semanaAtual, sequenciaVisivel } from '@/lib/dias'
import { usarPerfil } from '@/store/usarPerfil'
import { Estrela } from '@/design/Estrela'
import { celebrarAcerto } from '@/design/celebrar'
import { cn } from '@/design/cn'

/** Tela 6 do mockup, com os desafios exatamente como listados lá. */
const DIARIOS = [
  { id: 'agua', rotulo: 'Beber 5 copos de água', emoji: '💧' },
  { id: 'dormir', rotulo: 'Dormir cedo', emoji: '🌙' },
  { id: 'frutas', rotulo: 'Comer frutas', emoji: '🍎' },
  { id: 'verduras', rotulo: 'Comer verduras e legumes', emoji: '🥦' },
  { id: 'caminhada', rotulo: 'Fazer caminhada com a família', emoji: '🚶' },
]

const SEMANAIS = [
  { id: 'corda', rotulo: 'Pular corda', emoji: '🪢' },
  { id: 'jogo-familia', rotulo: 'Criar um jogo de movimento com a família', emoji: '🎲' },
]

type Marcados = Record<string, string[]>

export function DesafiosDaSaude() {
  const [marcados, setMarcados] = useState<Marcados>({})
  const sequencia = usarPerfil((e) => e.sequencia)
  const marcarDiaDeDesafio = usarPerfil((e) => e.marcarDiaDeDesafio)
  const diasSeguidos = sequenciaVisivel(sequencia)

  useEffect(() => {
    void ler<Marcados>(CHAVES.desafios, {}).then(setMarcados)
  }, [])

  const dia = hoje()
  const semana = semanaAtual()

  function alternar(periodo: string, id: string) {
    const atual = marcados[periodo] ?? []
    const marcando = !atual.includes(id)
    const proximo = marcando ? [...atual, id] : atual.filter((x) => x !== id)

    if (marcando) {
      celebrarAcerto()
      // Só o desafio DIÁRIO alimenta a sequência. O semanal seria um jeito
      // fácil demais de manter a corrente sem hábito nenhum.
      if (periodo === dia) marcarDiaDeDesafio()
    }

    const novos = { ...marcados, [periodo]: proximo }
    setMarcados(novos)
    void gravar(CHAVES.desafios, novos)
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <h1 className="text-4xl uppercase text-coral-500">Desafios da Saúde</h1>

      <Sequencia dias={diasSeguidos} />

      <Grupo
        titulo="Diários"
        subtitulo="Marque o que você já fez hoje"
        itens={DIARIOS}
        marcados={marcados[dia] ?? []}
        aoMarcar={(id) => alternar(dia, id)}
      />

      <Grupo
        titulo="Semanais"
        subtitulo="Você tem a semana toda"
        itens={SEMANAIS}
        marcados={marcados[semana] ?? []}
        aoMarcar={(id) => alternar(semana, id)}
      />

      <p className="rounded-bolha bg-sol-100 p-5 text-center font-display text-lg font-bold text-sol-600">
        Cada desafio cumprido ganha uma estrela ⭐
      </p>
    </div>
  )
}

/**
 * A corrente de dias.
 *
 * É o núcleo do laço diário, e aqui ela recompensa hábito real — beber água,
 * dormir cedo, caminhar com a família — e não tempo de tela. Num app cujo 5º
 * ano ensina equilíbrio no uso de telas, premiar permanência seria contradizer
 * o próprio conteúdo.
 */
function Sequencia({ dias }: { dias: number }) {
  if (dias === 0) {
    return (
      <div className="rounded-bolha border-4 border-dashed border-coral-200 bg-white p-5 text-center">
        <p className="font-display text-xl font-bold text-tinta-600">
          Marque um desafio hoje e comece a sua sequência! 🔥
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 rounded-bolha border-4 border-coral-300 bg-coral-100 p-5">
      <motion.span
        aria-hidden="true"
        className="text-6xl"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        🔥
      </motion.span>
      <div>
        <p className="font-display text-4xl font-extrabold leading-none text-coral-600">{dias}</p>
        <p className="font-display text-lg font-bold text-coral-600">
          {dias === 1 ? 'dia seguido' : 'dias seguidos'}
        </p>
      </div>
      <p className="ml-auto max-w-[14rem] text-right text-sm font-medium text-tinta-600">
        Marque um desafio todo dia para não perder a sequência.
      </p>
    </div>
  )
}

interface GrupoProps {
  titulo: string
  subtitulo: string
  itens: { id: string; rotulo: string; emoji: string }[]
  marcados: string[]
  aoMarcar: (id: string) => void
}

function Grupo({ titulo, subtitulo, itens, marcados, aoMarcar }: GrupoProps) {
  return (
    <section className="flex flex-col gap-3">
      <header>
        <h2 className="text-2xl uppercase text-tinta-900">{titulo}</h2>
        <p className="text-tinta-400">{subtitulo}</p>
      </header>

      <ul className="flex flex-col gap-3">
        {itens.map((item) => {
          const feito = marcados.includes(item.id)
          return (
            <li key={item.id}>
              <motion.button
                type="button"
                onClick={() => aoMarcar(item.id)}
                aria-pressed={feito}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex min-h-toque w-full items-center gap-4 rounded-bolha border-4 px-5 py-3 text-left transition-colors',
                  feito ? 'border-folha-400 bg-folha-100' : 'border-ceu-200 bg-white',
                )}
              >
                <span aria-hidden="true" className="text-4xl">
                  {item.emoji}
                </span>
                <span className="flex-1 font-display text-xl font-bold">{item.rotulo}</span>
                <Estrela cheia={feito} />
              </motion.button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
