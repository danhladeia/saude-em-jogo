import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CHAVES, gravar, ler } from '@/lib/armazenamento'
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

/** ISO curto no fuso local — o dia vira aqui à meia-noite do aluno. */
function hoje(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function semanaAtual(): string {
  const d = new Date()
  const inicio = new Date(d.getFullYear(), 0, 1)
  const dias = Math.floor((d.getTime() - inicio.getTime()) / 86_400_000)
  return `${d.getFullYear()}-S${Math.ceil((dias + inicio.getDay() + 1) / 7)}`
}

type Marcados = Record<string, string[]>

export function DesafiosDaSaude() {
  const [marcados, setMarcados] = useState<Marcados>({})

  useEffect(() => {
    void ler<Marcados>(CHAVES.desafios, {}).then(setMarcados)
  }, [])

  const dia = hoje()
  const semana = semanaAtual()

  function alternar(periodo: string, id: string) {
    const atual = marcados[periodo] ?? []
    const proximo = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]
    if (!atual.includes(id)) celebrarAcerto()

    const novos = { ...marcados, [periodo]: proximo }
    setMarcados(novos)
    void gravar(CHAVES.desafios, novos)
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <h1 className="text-4xl uppercase text-coral-500">Desafios da Saúde</h1>

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
