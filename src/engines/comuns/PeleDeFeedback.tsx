import { motion } from 'framer-motion'
import { Mascote } from '@/design/Mascote'
import { Estrela } from '@/design/Estrela'

type Pele = 'padrao' | 'energia' | 'equilibrio'
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
 */
export function PeleDeFeedback({ pele, estado, acertos, total }: PeleDeFeedbackProps) {
  if (pele === 'energia') return <Energia estado={estado} acertos={acertos} total={total} />
  if (pele === 'equilibrio') return <Equilibrio estado={estado} acertos={acertos} />
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
