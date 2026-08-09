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
import { cn } from '@/design/cn'

/**
 * Motor de arrastar-para-alvo — atende "Monte o corpo humano" e
 * "Como me sinto?".
 *
 * Usa @dnd-kit porque é a única biblioteca que cobre toque, mouse e
 * teclado com a mesma API: metade da turma joga em tablet e o app precisa
 * continuar operável só no teclado.
 */
export function MotorArrastarAlvo({ conteudo, aoConcluir }: PropsDeMotor<ConteudoArrastarAlvo>) {
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  /** pecaId -> alvoId onde ela foi encaixada corretamente. */
  const [encaixadas, setEncaixadas] = useState<Record<string, string>>({})
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [erros, setErros] = useState(0)
  const [recusada, setRecusada] = useState<string | null>(null)

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
      celebrarAcerto()
      if (narracaoLigada) narrar(peca.rotulo)
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* cenário com os alvos */}
          <div
            className="relative mx-auto w-full max-w-lg overflow-hidden rounded-bolha border-4 border-ceu-200 bg-white"
            style={{ aspectRatio: conteudo.cenario.proporcao, background: conteudo.cenario.corDeFundo }}
          >
            {conteudo.cenario.imagem && (
              <img
                src={conteudo.cenario.imagem}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
              />
            )}

            {conteudo.alvos.map((alvo) => {
              const peca = conteudo.pecas.find((p) => encaixadas[p.id] === alvo.id)
              return <Alvo key={alvo.id} alvo={alvo} peca={peca} />
            })}
          </div>

          {/* bandeja das peças */}
          <div className="flex-1">
            <h3 className="mb-3 text-center font-display text-xl font-bold text-tinta-400 lg:text-left">
              {terminou ? 'Tudo no lugar!' : 'Arraste para o lugar certo'}
            </h3>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
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
