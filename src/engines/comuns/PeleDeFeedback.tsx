import { motion } from 'framer-motion'
import { Mascote } from '@/design/Mascote'
import { Estrela } from '@/design/Estrela'
import { cn } from '@/design/cn'

type Pele = 'padrao' | 'energia' | 'equilibrio' | 'trilha'
type Estado = 'neutro' | 'acerto' | 'erro'

interface PeleDeFeedbackProps {
  pele: Pele
  estado: Estado
  acertos: number
  total: number
}

/**
 * Mesma mecânica de quiz, reação diferente por jogo.
 *
 * O documento da autora pede feedback específico: "cada acerto aumenta o
 * nível de energia do personagem" em Movimente-se, e "o personagem ganha
 * estrelas de equilíbrio e se mantém de pé sobre uma prancha; se errar, o
 * personagem cai" em Equilibrista mirim. São peles, não motores novos.
 *
 * A pele 'trilha' é o que dispensa o motor "trilha" do plano original: a
 * "Trilha saudável do sono" é um quiz onde cada acerto anda uma casa até a
 * cama. O tabuleiro é a moldura, não a mecânica.
 */
export function PeleDeFeedback({ pele, estado, acertos, total }: PeleDeFeedbackProps) {
  if (pele === 'energia') return <Energia estado={estado} acertos={acertos} total={total} />
  if (pele === 'equilibrio') return <Equilibrio estado={estado} acertos={acertos} />
  if (pele === 'trilha') return <Trilha estado={estado} acertos={acertos} total={total} />
  return (
    <Mascote
      humor={estado === 'acerto' ? 'comemorando' : estado === 'erro' ? 'apoiando' : 'feliz'}
      className="h-28"
    />
  )
}

function Energia({ estado, acertos, total }: { estado: Estado; acertos: number; total: number }) {
  const percentual = total === 0 ? 0 : Math.round((acertos / total) * 100)

  return (
    <div className="flex items-center gap-4">
      <Mascote humor={estado === 'acerto' ? 'comemorando' : 'feliz'} className="h-28" />
      <div className="flex flex-col gap-2">
        <span className="font-display text-base font-bold uppercase text-tinta-400">Energia</span>
        <div
          className="h-10 w-40 overflow-hidden rounded-full border-4 border-folha-600 bg-white"
          role="meter"
          aria-valuenow={percentual}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Nível de energia do personagem"
        >
          <motion.div
            className="h-full bg-folha-400"
            animate={{ width: `${percentual}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          />
        </div>
        <span className="font-display text-xl font-extrabold text-folha-600">{percentual}%</span>
      </div>
    </div>
  )
}

function Trilha({ estado, acertos, total }: { estado: Estado; acertos: number; total: number }) {
  const casas = Math.max(total, 1)
  // A casa final é a cama; a criança anda uma casa por acerto.
  const posicao = Math.min(acertos, casas)
  const percentual = (posicao / casas) * 100

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <span className="font-display text-base font-bold uppercase text-tinta-400">
        Trilha do sono
      </span>

      <div
        className="relative h-20"
        role="meter"
        aria-valuenow={posicao}
        aria-valuemin={0}
        aria-valuemax={casas}
        aria-label="Casas andadas na trilha do sono"
      >
        {/* o caminho */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center gap-1">
          {Array.from({ length: casas }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-3 flex-1 rounded-full',
                i < posicao ? 'bg-uva-400' : 'bg-ceu-100',
              )}
            />
          ))}
          <span className="pl-1 text-2xl" aria-hidden>
            🛏️
          </span>
        </div>

        {/* quem anda */}
        <motion.div
          className="absolute bottom-5"
          animate={{ left: `calc(${percentual}% - 1.5rem)` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          <Mascote
            humor={estado === 'acerto' ? 'pulando' : estado === 'erro' ? 'apoiando' : 'feliz'}
            className="h-16"
          />
        </motion.div>
      </div>
    </div>
  )
}

function Equilibrio({ estado, acertos }: { estado: Estado; acertos: number }) {
  const caiu = estado === 'erro'

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={caiu ? { rotate: 75, y: 18 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        style={{ transformOrigin: 'bottom center' }}
      >
        <Mascote humor={caiu ? 'apoiando' : estado === 'acerto' ? 'comemorando' : 'feliz'} className="h-28" />
      </motion.div>

      {/* a prancha */}
      <div className="h-3 w-36 rounded-full bg-coral-400" />
      <div className="h-4 w-4 rotate-45 bg-tinta-600" />

      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: Math.min(acertos, 5) }, (_, i) => (
          <Estrela key={i} cheia className="h-7 w-7" />
        ))}
      </div>
    </div>
  )
}
