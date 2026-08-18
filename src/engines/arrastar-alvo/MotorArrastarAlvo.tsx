import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import type { ConteudoArrastarAlvo } from '@/content/schemas'
import type { PropsDeMotor } from '../tipos'
import { Enunciado } from '../comuns/Enunciado'
import { Figura } from '../comuns/Figura'
import { Botao } from '@/design/Botao'
import { celebrarAcerto } from '@/design/celebrar'
import { narrar } from '@/lib/narracao'
import { usarPerfil } from '@/store/usarPerfil'
import { urlDoSprite } from '@/assets/registro'
import { cn } from '@/design/cn'

/**
 * Motor de arrastar-para-alvo.
 *
 * Três desenhos de tela, uma mecânica só: `cenario` (Monte o corpo humano,
 * Como me sinto?), `colunas` (classificar, montar o prato, separar o lixo) e
 * `linha-do-tempo` (organizar o dia). Ver o campo `layout` em
 * src/content/schemas.ts.
 *
 * Usa @dnd-kit porque é a única biblioteca que cobre toque, mouse e
 * teclado com a mesma API: metade da turma joga em tablet e o app precisa
 * continuar operável só no teclado.
 */
export function MotorArrastarAlvo({ conteudo, aoConcluir }: PropsDeMotor<ConteudoArrastarAlvo>) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)
  const personagem = usarPerfil((e) => e.perfil.personagem)

  /** pecaId -> alvoId onde ela foi encaixada corretamente. */
  const [encaixadas, setEncaixadas] = useState<Record<string, string>>({})
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [erros, setErros] = useState(0)
  const [recusada, setRecusada] = useState<string | null>(null)
  /** Última explicação de acerto — é onde o conteúdo dos jogos de classificar mora. */
  const [aprendizado, setAprendizado] = useState<string | null>(null)

  const sensores = useSensors(
    // 6px de tolerância: dedo de criança treme, e sem isso todo toque
    // vira um arraste de 2px que cancela o clique.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  )

  const pendentes = conteudo.pecas.filter((p) => !encaixadas[p.id])
  const terminou = pendentes.length === 0

  function aoIniciar(evento: DragStartEvent) {
    setArrastando(String(evento.active.id))
    setRecusada(null)
  }

  function aoSoltar(evento: DragEndEvent) {
    setArrastando(null)
    const pecaId = String(evento.active.id)
    const alvoId = evento.over ? String(evento.over.id) : null
    if (!alvoId) return

    const peca = conteudo.pecas.find((p) => p.id === pecaId)
    if (!peca) return

    if (peca.alvoId === alvoId) {
      const proximas = { ...encaixadas, [pecaId]: alvoId }
      setEncaixadas(proximas)
      setAprendizado(peca.explicacao ?? null)
      celebrarAcerto()
      if (narracaoLigada) narrar(peca.explicacao ?? peca.rotulo)
    } else {
      // Erro não pune: a peça volta e a criança tenta de novo.
      setErros((n) => n + 1)
      setRecusada(pecaId)
      if (narracaoLigada) narrar('Tente outro lugar.')
      setTimeout(() => setRecusada(null), 600)
    }
  }

  const avisos: Announcements = {
    onDragStart: ({ active }) => `Pegou ${rotuloDaPeca(conteudo, String(active.id))}.`,
    onDragOver: ({ over }) => (over ? `Sobre ${rotuloDoAlvo(conteudo, String(over.id))}.` : ''),
    onDragEnd: ({ over }) =>
      over ? `Soltou em ${rotuloDoAlvo(conteudo, String(over.id))}.` : 'Soltou fora.',
    onDragCancel: () => 'Arraste cancelado.',
  }

  // O dnd-kit injeta estas instruções em inglês por padrão; num app para
  // crianças brasileiras isso é texto morto no leitor de tela.
  const instrucoes = {
    draggable:
      'Para pegar uma peça, aperte a barra de espaço. ' +
      'Use as setas para mover a peça até o lugar certo. ' +
      'Aperte a barra de espaço de novo para soltar, ou Esc para cancelar.',
  }

  const pecaArrastada = conteudo.pecas.find((p) => p.id === arrastando)

  return (
    <div className="flex flex-col gap-6">
      <Enunciado texto={conteudo.instrucao} chave={conteudo.id} />

      <DndContext
        sensors={sensores}
        accessibility={{ announcements: avisos, screenReaderInstructions: instrucoes }}
        onDragStart={aoIniciar}
        onDragEnd={aoSoltar}
      >
        <div
          className={cn(
            'flex flex-col gap-6',
            conteudo.layout === 'cenario' && 'lg:flex-row lg:items-start',
          )}
        >
          {conteudo.layout === 'cenario' ? (
            /* O cenário é dimensionado pela ALTURA, não pela largura.
               Um cenário em pé (proporção 0,72) com largura de 32rem daria
               711px de altura — mais que a tela de 768px de um laboratório
               escolar, empurrando a bandeja de peças para fora do campo de
               visão. A criança teria que rolar a página no meio do arraste. */
            <div
              className="relative mx-auto max-w-full shrink-0 overflow-hidden rounded-bolha border-4 border-ceu-200 bg-white"
              style={{
                aspectRatio: conteudo.cenario.proporcao,
                height: 'min(70vh, 36rem)',
                background: conteudo.cenario.corDeFundo,
              }}
            >
              {urlDoSprite(conteudo.cenario.imagem, personagem) && (
                <img
                  src={urlDoSprite(conteudo.cenario.imagem, personagem)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}

              {conteudo.alvos.map((alvo) => {
                const peca = conteudo.pecas.find((p) => encaixadas[p.id] === alvo.id)
                return <Alvo key={alvo.id} alvo={alvo} peca={peca} />
              })}
            </div>
          ) : (
            /* Caixas grandes: a criança de 8 anos precisa de alvo do tamanho
               da mão, não de um retângulo de 20% do cenário. */
            <ol
              className={cn(
                'grid gap-3',
                conteudo.layout === 'linha-do-tempo'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  : conteudo.alvos.length > 2
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2',
              )}
            >
              {conteudo.alvos.map((alvo, indice) => (
                <li key={alvo.id}>
                  <Caixa
                    alvo={alvo}
                    ordem={conteudo.layout === 'linha-do-tempo' ? indice + 1 : undefined}
                    pecas={conteudo.pecas.filter((p) => encaixadas[p.id] === alvo.id)}
                  />
                </li>
              ))}
            </ol>
          )}

          {/* bandeja das peças */}
          <div className="flex-1">
            <h3 className="mb-3 text-center font-display text-xl font-bold text-tinta-400 lg:text-left">
              {terminou ? 'Tudo no lugar!' : 'Arraste para o lugar certo'}
            </h3>
            <ul
              className={cn(
                'grid gap-3',
                conteudo.layout === 'cenario'
                  ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-3'
                  : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6',
              )}
            >
              {pendentes.map((peca) => (
                <li key={peca.id}>
                  <Peca peca={peca} recusada={recusada === peca.id} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {pecaArrastada && (
            <div className="pointer-events-none flex items-center justify-center rounded-bolha border-4 border-ceu-400 bg-white p-3 shadow-flutuante">
              <Figura item={pecaArrastada} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Por que a peça vai ali. Sem isto o jogo de classificar vira
          tentativa e erro — a criança acerta e não aprende nada. */}
      {aprendizado && (
        <motion.p
          key={aprendizado}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="rounded-bolha border-4 border-folha-200 bg-folha-100 px-4 py-3 text-center text-lg text-tinta-600"
        >
          {aprendizado}
        </motion.p>
      )}

      {terminou && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Botao
            cor="folha"
            tamanho="grande"
            largo
            onClick={() =>
              aoConcluir({
                acertos: Math.max(conteudo.pecas.length - erros, 0),
                total: conteudo.pecas.length,
              })
            }
          >
            Terminei!
          </Botao>
        </motion.div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

type Alvo = ConteudoArrastarAlvo['alvos'][number]
type Peca = ConteudoArrastarAlvo['pecas'][number]

function Alvo({ alvo, peca }: { alvo: Alvo; peca?: Peca }) {
  const { setNodeRef, isOver } = useDroppable({ id: alvo.id })

  return (
    <div
      ref={setNodeRef}
      aria-label={alvo.rotulo}
      className={cn(
        'absolute grid place-items-center rounded-2xl border-4 border-dashed transition-colors',
        peca
          ? 'border-solid border-folha-400 bg-folha-100'
          : isOver
            ? 'border-ceu-400 bg-ceu-100'
            : 'border-ceu-200 bg-ceu-50/60',
      )}
      style={{
        left: `${alvo.x - alvo.largura / 2}%`,
        top: `${alvo.y - alvo.altura / 2}%`,
        width: `${alvo.largura}%`,
        height: `${alvo.altura}%`,
      }}
    >
      {peca ? (
        <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
          <Figura item={peca} semTexto />
        </motion.div>
      ) : (
        <span className="px-1 text-center text-xs font-bold text-tinta-400">{alvo.rotulo}</span>
      )}
    </div>
  )
}

/**
 * Cores da caixa. Escritas por extenso porque o Tailwind varre o código
 * como texto: `border-${cor}-400` não existe no CSS final e a caixa sai
 * sem cor nenhuma na aula.
 */
const CORES = {
  ceu: 'border-ceu-400 bg-ceu-100',
  folha: 'border-folha-400 bg-folha-100',
  sol: 'border-sol-400 bg-sol-100',
  coral: 'border-coral-400 bg-coral-100',
  uva: 'border-uva-400 bg-uva-100',
} as const

/** Alvo dos layouts 'colunas' e 'linha-do-tempo': caixa grande, várias peças. */
function Caixa({ alvo, pecas, ordem }: { alvo: Alvo; pecas: Peca[]; ordem?: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: alvo.id })
  const cor = alvo.cor ? CORES[alvo.cor] : 'border-ceu-200 bg-white'

  return (
    <div
      ref={setNodeRef}
      aria-label={alvo.legenda ? `${alvo.rotulo}, ${alvo.legenda}` : alvo.rotulo}
      className={cn(
        'flex h-full min-h-[11rem] flex-col gap-2 rounded-bolha border-4 p-3 transition-colors',
        cor,
        isOver && 'border-dashed border-ceu-500 bg-ceu-100',
      )}
    >
      <div className="flex items-center gap-2">
        {ordem !== undefined && (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tinta-600 font-display text-base font-extrabold text-white">
            {ordem}
          </span>
        )}
        {(alvo.imagem || alvo.emoji) && (
          <Figura
            item={{ imagem: alvo.imagem, emoji: alvo.emoji, rotulo: alvo.rotulo }}
            semTexto
            tamanho="pequeno"
          />
        )}
        <div className="min-w-0">
          <p className="font-display text-lg font-bold leading-tight">{alvo.rotulo}</p>
          {alvo.legenda && <p className="text-sm text-tinta-400">{alvo.legenda}</p>}
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {pecas.map((peca) => (
          <motion.li key={peca.id} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>
            <span className="grid size-16 place-items-center rounded-2xl border-2 border-folha-300 bg-white">
              <Figura item={peca} semTexto tamanho="pequeno" />
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

function Peca({ peca, recusada }: { peca: Peca; recusada: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: peca.id })

  return (
    <motion.button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      animate={recusada ? { x: [0, -8, 8, -6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex min-h-[7rem] w-full cursor-grab touch-none flex-col items-center justify-center rounded-bolha border-4 bg-white p-2',
        recusada ? 'border-coral-400' : 'border-ceu-200 hover:border-ceu-400',
        isDragging && 'opacity-30',
      )}
    >
      <Figura item={peca} />
    </motion.button>
  )
}

function rotuloDaPeca(conteudo: ConteudoArrastarAlvo, id: string) {
  return conteudo.pecas.find((p) => p.id === id)?.rotulo ?? 'peça'
}

function rotuloDoAlvo(conteudo: ConteudoArrastarAlvo, id: string) {
  return conteudo.alvos.find((a) => a.id === id)?.rotulo ?? 'lugar'
}
