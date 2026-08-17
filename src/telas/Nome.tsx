import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Botao } from '@/design/Botao'
import { Card } from '@/design/Card'
import { Mascote, RetratoDoPersonagem } from '@/design/Mascote'
import { usarPerfil } from '@/store/usarPerfil'
import { ANOS, TITULO_DO_ANO } from '@/dominio/catalogo'
import { narrar } from '@/lib/narracao'
import { cn } from '@/design/cn'
import type { Ano, Personagem } from '@/dominio/tipos'

const PERSONAGENS: { id: Personagem; rotulo: string }[] = [
  { id: 'menino', rotulo: 'Menino' },
  { id: 'menina', rotulo: 'Menina' },
]

/**
 * Tela 2 do mockup: "Seja bem vindo!!! Digite o seu nome:".
 *
 * O ano escolar não está no mockup, mas sem ele o app não sabe qual das
 * cinco trilhas abrir — e a professora aplica a intervenção por turma.
 */
export function Nome() {
  const navegar = useNavigate()
  const definirNome = usarPerfil((e) => e.definirNome)
  const definirAno = usarPerfil((e) => e.definirAno)
  const definirPersonagem = usarPerfil((e) => e.definirPersonagem)
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  const [nome, setNome] = useState('')
  const [ano, setAno] = useState<Ano | null>(null)
  const [personagem, setPersonagem] = useState<Personagem | null>(null)

  useEffect(() => {
    if (narracaoLigada) narrar('Seja bem-vindo! Digite o seu nome.')
  }, [narracaoLigada])

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (!nome.trim() || ano === null || personagem === null) return
    definirNome(nome)
    definirAno(ano)
    definirPersonagem(personagem)
    // Aluno recém-cadastrado nunca respondeu o pré. Mandar para o menu aqui
    // deixaria a criança começar a jogar e o dado de linha de base se perderia
    // — e sem linha de base a dissertação não tem o que comparar.
    navegar('/questionario/pre')
  }

  return (
    <div className="fundo-ceu flex min-h-dvh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl">
        <div className="flex flex-col items-center gap-6">
          <Mascote humor="feliz" />

          <h1 className="text-center text-4xl text-ceu-600">Seja bem-vindo!</h1>

          <form onSubmit={enviar} className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-3">
              <label htmlFor="campo-nome" className="font-display text-2xl font-bold">
                Digite o seu nome:
              </label>
              <input
                id="campo-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoFocus
                autoComplete="off"
                maxLength={24}
                className="min-h-toque rounded-bolha border-4 border-ceu-200 bg-white px-6 text-3xl font-bold outline-none focus:border-ceu-400"
              />
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 font-display text-2xl font-bold">
                Quem vai jogar com você?
              </legend>
              <div className="grid grid-cols-2 gap-4">
                {PERSONAGENS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonagem(p.id)}
                    aria-pressed={personagem === p.id}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-bolha border-4 p-4 transition-colors',
                      personagem === p.id
                        ? 'border-folha-400 bg-folha-100'
                        : 'border-ceu-100 bg-white hover:border-ceu-300',
                    )}
                  >
                    <RetratoDoPersonagem personagem={p.id} className="max-h-40" />
                    <span className="font-display text-xl font-bold">{p.rotulo}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-2 font-display text-2xl font-bold">Em que ano você está?</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ANOS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAno(n)}
                    aria-pressed={ano === n}
                    className={cn(
                      'flex min-h-toque items-center gap-4 rounded-bolha border-4 px-5 text-left transition-colors',
                      ano === n
                        ? 'border-folha-400 bg-folha-100'
                        : 'border-ceu-100 bg-white hover:border-ceu-300',
                    )}
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ceu-400 font-display text-2xl font-extrabold text-white">
                      {n}
                    </span>
                    <span className="font-display text-lg font-bold leading-tight">
                      {n}º ano
                      <span className="block text-sm font-medium text-tinta-400">
                        {TITULO_DO_ANO[n]}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <Botao
              type="submit"
              cor="folha"
              tamanho="grande"
              largo
              disabled={!nome.trim() || ano === null || personagem === null}
            >
              Vamos jogar!
            </Botao>
          </form>
        </div>
      </Card>
    </div>
  )
}
