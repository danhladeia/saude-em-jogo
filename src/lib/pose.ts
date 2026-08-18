import type { Ponto } from '@/content/poses'

/**
 * Detecção de pose para conferir o movimento da criança.
 *
 * NADA É GRAVADO. Não existe MediaRecorder, não existe canvas virando
 * blob, não existe upload. O quadro da câmera entra no detector, vira 33
 * coordenadas, e é descartado. As coordenadas vivem em memória enquanto o
 * exercício está na tela e somem com ele. É a mesma regra do resto do app:
 * nada sai do dispositivo.
 *
 * O detector pesa ~17 MB entre WASM e modelo e fica FORA do precache do
 * service worker (ver vite.config.ts): escola sem webcam nenhuma não deve
 * baixar isso. Por isso o import é dinâmico e a inicialização preguiçosa.
 */

const BASE = import.meta.env.BASE_URL

export type EstadoDaCamera =
  | 'ocioso'
  | 'carregando'
  | 'pronto'
  | 'sem-camera'
  | 'sem-permissao'
  | 'sem-suporte'
  | 'falhou'

type Landmarker = {
  detectForVideo: (v: HTMLVideoElement, t: number) => { landmarks: Ponto[][] }
  close: () => void
}

let landmarker: Landmarker | null = null
let carregando: Promise<Landmarker> | null = null

/** Sinaliza se o navegador tem o que é preciso, sem baixar nada. */
export function suportaCamera(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getUserMedia === 'function' &&
    typeof WebAssembly === 'object'
  )
}

/**
 * Carrega o detector. Só é chamado quando a criança realmente abre um
 * exercício com verificação — é aqui que os 17 MB descem, uma vez só, e
 * depois saem do cache do service worker.
 */
export function carregarDetector(): Promise<Landmarker> {
  if (landmarker) return Promise.resolve(landmarker)
  if (carregando) return carregando

  carregando = (async () => {
    const visao = await import('@mediapipe/tasks-vision')
    const fileset = await visao.FilesetResolver.forVisionTasks(`${BASE}pose/wasm`)

    const criar = (delegate: 'GPU' | 'CPU') =>
      visao.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: `${BASE}pose/pose_landmarker_lite.task`,
          delegate,
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      })

    // Máquina de laboratório costuma ter driver de vídeo antigo, onde o
    // caminho de GPU falha na criação. A CPU é mais lenta e suficiente:
    // conferir uma pose não precisa de 60 quadros por segundo.
    let lm
    try {
      lm = await criar('GPU')
    } catch {
      lm = await criar('CPU')
    }

    landmarker = lm as unknown as Landmarker
    return landmarker
  })()

  carregando.catch(() => {
    carregando = null
  })

  return carregando
}

export interface Camera {
  video: HTMLVideoElement
  parar: () => void
}

/**
 * Abre a câmera frontal em resolução baixa. 480p sobra para achar
 * articulação e é o que uma webcam velha entrega sem engasgar.
 */
export async function abrirCamera(): Promise<Camera> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
    audio: false,
  })

  const video = document.createElement('video')
  video.srcObject = stream
  video.playsInline = true
  video.muted = true
  await video.play()

  return {
    video,
    parar: () => {
      for (const faixa of stream.getTracks()) faixa.stop()
      video.srcObject = null
    },
  }
}

/** Traduz a falha de getUserMedia no estado que a tela sabe explicar. */
export function estadoDoErro(erro: unknown): EstadoDaCamera {
  const nome = (erro as { name?: string })?.name
  if (nome === 'NotAllowedError' || nome === 'SecurityError') return 'sem-permissao'
  if (nome === 'NotFoundError' || nome === 'DevicesNotFoundError') return 'sem-camera'
  if (nome === 'NotReadableError' || nome === 'TrackStartError') return 'falhou'
  return 'falhou'
}

/** Libera o detector. A câmera é fechada por quem a abriu. */
export function descartarDetector() {
  landmarker?.close()
  landmarker = null
  carregando = null
}
