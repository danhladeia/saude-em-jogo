import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { BlocoCorpoAtivo } from '@/content/schemas'
import { Cronometro } from './Cronometro'
import { Botao } from '@/design/Botao'
import { Mascote } from '@/design/Mascote'
import { celebrarConclusao } from '@/design/celebrar'
import { narrar } from '@/lib/narracao'
import { usarPerfil } from '@/store/usarPerfil'
import { cn } from '@/design/cn'

interface CorpoAtivoProps {
  bloco: BlocoCorpoAtivo
  aoConcluir: (emocao?: string) => void
}

type Etapa = 'convite' | 'movendo' | 'emocao'

/**
 * O movimento real, dentro do app.
 *
 * Sem isto, "letramento corporal" viraria clicar na resposta certa sobre
 * o corpo. O documento da autora pede prática corporal explícita em
 * Corpo que dança ("o aluno deve repetir os movimentos com o corpo"),
 * Equilibrista mirim ("segundo momento: praticar o equilíbrio real"),
 * Roleta de alongamentos e Corpo em ação.
 *
 * Sem câmera, de propósito: são crianças, e a cartilha já coloca o
 * professor como mediador presencial. O app cronometra e guia; quem
 * observa é a professora.
 */
export function CorpoAtivo({ bloco, aoConcluir }: CorpoAtivoProps) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  const [etapa, setEtapa] = useState<Etapa>('convite')
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  /** Cada passo só pode ser vencido uma vez. Protege contra o toque duplo
   *  da criança e contra o cronômetro disparar junto com o botão. */
  const jaAvancou = useRef(-1)

  const passo = bloco.passos[indice]
  const ultimo = indice === bloco.passos.length - 1

  useEffect(() => {
    if (etapa === 'movendo' && narracaoLigada) narrar(`${passo.rotulo}. ${passo.descricao}`)
  }, [etapa, passo, narracaoLigada])

  function proximo() {
    if (jaAvancou.current === indice) return
    jaAvancou.current = indice

    if (ultimo) {
      celebrarConclusao()
      if (bloco.perguntaEmocao) setEtapa('emocao')
      else aoConcluir()
      return
    }
    setIndice((i) => Math.min(i + 1, bloco.passos.length - 1))
  }

  if (etapa === 'convite') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <Mascote humor="comemorando" className="h-36" />
        <h2 className="text-4xl text-folha-600">{bloco.titulo}</h2>
        <p className="max-w-xl text-xl text-tinta-600">{bloco.instrucao}</p>
        <p className="rounded-bolha bg-sol-100 px-6 py-4 font-display text-lg font-bold text-sol-600">
          Levante da cadeira e deixe espaço ao seu redor!
        </p>
        <Botao
          cor="folha"
          tamanho="grande"
          onClick={() => {
            setEtapa('movendo')
            setIndice(0)
          }}
        >
          Vamos mexer o corpo!
        </Botao>
      </div>
    )
  }

  if (etapa === 'emocao' && bloco.perguntaEmocao) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Mascote humor="feliz" className="h-32" />
        <h2 className="text-center text-3xl">{bloco.perguntaEmocao.enunciado}</h2>
        <ul className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
          {bloco.perguntaEmocao.opcoes.map((opcao) => (
            <li key={opcao.id}>
              <button
                type="button"
                onClick={() => aoConcluir(opcao.id)}
                className="flex min-h-[9rem] w-full flex-col items-center justify-center gap-2 rounded-bolha border-4 border-ceu-200 bg-white p-4 transition-colors hover:border-ceu-400"
              >
                <span aria-hidden="true" className="text-5xl">
                  {opcao.emoji}
                </span>
                <span className="font-display text-lg font-bold">{opcao.rotulo}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full items-center gap-2">
        {bloco.passos.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              'h-3 flex-1 rounded-full',
              i < indice ? 'bg-folha-400' : i === indice ? 'bg-ceu-400' : 'bg-ceu-100',
            )}
          />
        ))}
      </div>

      {/* Sem mode="wait": ele segura o passo antigo na tela enquanto anima
          a saída, e a criança acaba repetindo o mesmo movimento enquanto o
          app já avançou por dentro. */}
      <div className="contents">
        <motion.div
          key={passo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {passo.imagem ? (
            <img src={passo.imagem} alt="" className="h-48 w-auto object-contain" />
          ) : (
            <span aria-hidden="true" className="text-8xl">
              {passo.emoji ?? '🤸'}
            </span>
          )}

          <h2 className="text-4xl text-ceu-600">{passo.rotulo}</h2>
          <p className="max-w-xl text-xl text-tinta-600">{passo.descricao}</p>

          <Cronometro
            segundos={passo.segundos}
            chave={passo.id}
            pausado={pausado}
            aoTerminar={proximo}
          />
        </motion.div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Botao cor="neutro" onClick={() => setPausado((p) => !p)}>
          {pausado ? '▶ Continuar' : '⏸ Pausar'}
        </Botao>
        {/* Saída sempre disponível: criança cansa, machuca ou se distrai,
            e ficar presa num cronômetro é frustração garantida. */}
        <Botao cor="ceu" onClick={proximo}>
          {ultimo ? 'Terminei!' : 'Já fiz, próximo →'}
        </Botao>
      </div>
    </div>
  )
}
