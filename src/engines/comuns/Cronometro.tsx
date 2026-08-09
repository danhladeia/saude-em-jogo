import { useEffect, useRef, useState } from 'react'

interface CronometroProps {
  segundos: number
  /** Reinicia a contagem quando muda. */
  chave: string | number
  aoTerminar: () => void
  pausado?: boolean
}

/**
 * Contagem regressiva grande o bastante para ser lida de longe — a
 * criança está de pé fazendo o movimento, não sentada olhando a tela.
 */
export function Cronometro({ segundos, chave, aoTerminar, pausado = false }: CronometroProps) {
  const [restante, setRestante] = useState(segundos)
  const terminarRef = useRef(aoTerminar)
  terminarRef.current = aoTerminar
  /** Trava contra disparo duplo (StrictMode, re-render na virada do zero). */
  const disparado = useRef(false)

  useEffect(() => {
    setRestante(segundos)
    disparado.current = false
  }, [segundos, chave])

  useEffect(() => {
    if (pausado) return
    if (restante <= 0) {
      if (!disparado.current) {
        disparado.current = true
        terminarRef.current()
      }
      return
    }
    const id = setTimeout(() => setRestante((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [restante, pausado])

  const fracao = segundos === 0 ? 0 : restante / segundos
  const circunferencia = 2 * Math.PI * 54

  return (
    <div
      className="relative grid size-40 place-items-center"
      role="timer"
      aria-live="off"
      aria-label={`${restante} segundos restantes`}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-ceu-100)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="var(--color-folha-400)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - fracao)}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="font-display text-5xl font-extrabold text-folha-600">{restante}</span>
    </div>
  )
}
