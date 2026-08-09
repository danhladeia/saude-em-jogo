import { useEffect } from 'react'
import { usarPerfil } from '@/store/usarPerfil'
import { narrar } from '@/lib/narracao'

interface EnunciadoProps {
  texto: string
  /** Refala sempre que mudar — normalmente o índice da pergunta. */
  chave?: string | number
  className?: string
}

/**
 * Todo enunciado é lido em voz alta. No 1º ano boa parte da turma ainda
 * não lê com fluência; sem narração o jogo vira adivinhação.
 */
export function Enunciado({ texto, chave, className }: EnunciadoProps) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  useEffect(() => {
    if (narracaoLigada) narrar(texto)
  }, [texto, chave, narracaoLigada])

  return (
    <div className={className}>
      <h2 className="text-center text-3xl leading-snug text-tinta-900">{texto}</h2>
      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => narrar(texto)}
          className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-base font-bold text-ceu-600 shadow-flutuante"
        >
          <span aria-hidden="true">🔊</span> Ouvir de novo
        </button>
      </div>
    </div>
  )
}
