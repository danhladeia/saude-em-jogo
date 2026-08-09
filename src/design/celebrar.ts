import confetti from 'canvas-confetti'
import { movimentoReduzido } from '@/lib/movimento'

const CORES = ['#4FC3F7', '#66BB6A', '#FFCA28', '#FF7043', '#A175F2']

/** Comemoração curta — acerto dentro de uma rodada. */
export function celebrarAcerto() {
  if (movimentoReduzido()) return
  confetti({
    particleCount: 40,
    spread: 55,
    startVelocity: 28,
    origin: { y: 0.7 },
    colors: CORES,
    disableForReducedMotion: true,
  })
}

/** Comemoração grande — atividade inteira concluída. */
export function celebrarConclusao() {
  if (movimentoReduzido()) return
  const fim = Date.now() + 1200
  const disparar = () => {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors: CORES })
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors: CORES })
    if (Date.now() < fim) requestAnimationFrame(disparar)
  }
  disparar()
}
