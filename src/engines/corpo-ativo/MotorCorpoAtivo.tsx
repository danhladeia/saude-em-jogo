import type { ConteudoCorpoAtivo } from '@/content/schemas'
import type { PropsDeMotor } from '../tipos'
import { CorpoAtivo } from '../comuns/CorpoAtivo'

/**
 * Atividades que são só movimento: "Corpo que dança" (1º ano) e
 * "Corpo em ação" (5º ano).
 *
 * Não há acerto ou erro — fazer é o objetivo. Sai sempre com resultado
 * cheio, que vira três estrelas.
 */
export function MotorCorpoAtivo({ conteudo, aoConcluir }: PropsDeMotor<ConteudoCorpoAtivo>) {
  return (
    <CorpoAtivo
      bloco={conteudo.bloco}
      aoConcluir={() =>
        aoConcluir({ acertos: conteudo.bloco.passos.length, total: conteudo.bloco.passos.length })
      }
    />
  )
}
