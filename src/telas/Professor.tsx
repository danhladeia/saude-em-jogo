import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import bruto from '@/content/questionario/perguntas.json'
import { ConteudoQuestionario } from '@/content/questionario/schema'
import { usarPerfil } from '@/store/usarPerfil'
import { baixarCsv, csvDosAlunos } from '@/lib/exportar'
import { comoDia } from '@/lib/dias'
import { Botao } from '@/design/Botao'
import { Card } from '@/design/Card'
import { cn } from '@/design/cn'

const QUESTIONARIO = ConteudoQuestionario.parse(bruto)

/**
 * PIN fixo, e de propósito.
 *
 * Ele não guarda segredo nenhum — os dados já estão em texto claro no
 * IndexedDB da máquina. Serve só para uma criança de 8 anos não cair aqui por
 * acidente e apagar a turma. Segurança de verdade neste projeto é o dado nunca
 * sair do dispositivo.
 */
const PIN = '2024'

export function Professor() {
  const navegar = useNavigate()
  const alunos = usarPerfil((e) => e.alunos)
  const [liberado, setLiberado] = useState(false)
  const [pin, setPin] = useState('')
  const [erro, setErro] = useState(false)

  function entrar(evento: FormEvent) {
    evento.preventDefault()
    if (pin === PIN) setLiberado(true)
    else {
      setErro(true)
      setPin('')
    }
  }

  if (!liberado) {
    return (
      <div className="fundo-ceu flex min-h-dvh items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <form onSubmit={entrar} className="flex flex-col gap-4">
            <h1 className="text-2xl">Área do Professor</h1>
            <label htmlFor="pin" className="font-display font-bold">
              Digite o PIN
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              autoFocus
              value={pin}
              onChange={(e) => {
                setPin(e.target.value)
                setErro(false)
              }}
              className="min-h-toque rounded-bolha border-4 border-ceu-200 px-5 text-2xl outline-none focus:border-ceu-400"
            />
            {erro && <p className="font-bold text-coral-500">PIN incorreto.</p>}
            <Botao type="submit" cor="ceu" largo>
              Entrar
            </Botao>
            <button
              type="button"
              onClick={() => navegar('/menu')}
              className="text-tinta-400 underline"
            >
              Voltar ao app
            </button>
          </form>
        </Card>
      </div>
    )
  }

  const lista = Object.values(alunos).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  const comPre = lista.filter((a) => a.pre).length
  const comPos = lista.filter((a) => a.pos).length

  return (
    <div className="fundo-ceu min-h-dvh px-4 py-6">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl">Área do Professor</h1>
          <button onClick={() => navegar('/menu')} className="ml-auto text-tinta-400 underline">
            Voltar ao app
          </button>
        </header>

        <div className="grid grid-cols-3 gap-3">
          {[
            { rotulo: 'Alunos', valor: lista.length },
            { rotulo: 'Responderam o pré', valor: comPre },
            { rotulo: 'Responderam o pós', valor: comPos },
          ].map((c) => (
            <div key={c.rotulo} className="rounded-bolha bg-white p-4 text-center shadow-flutuante">
              <p className="font-display text-4xl font-extrabold text-ceu-600">{c.valor}</p>
              <p className="text-sm font-bold text-tinta-400">{c.rotulo}</p>
            </div>
          ))}
        </div>

        <Botao
          cor="folha"
          tamanho="grande"
          largo
          disabled={lista.length === 0}
          onClick={() =>
            baixarCsv(`saude-em-jogo-${comoDia(new Date())}.csv`, csvDosAlunos(alunos, QUESTIONARIO))
          }
        >
          ⬇ Exportar CSV para análise
        </Botao>

        {lista.length === 0 ? (
          <p className="rounded-bolha border-4 border-dashed border-ceu-200 p-8 text-center text-tinta-600">
            Nenhum aluno usou este computador ainda.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-bolha bg-white shadow-flutuante">
            <table className="w-full min-w-[36rem] text-left">
              <thead className="bg-ceu-50">
                <tr className="font-display text-sm uppercase text-tinta-400">
                  <th className="p-3">Aluno</th>
                  <th className="p-3">Ano</th>
                  <th className="p-3">Pré</th>
                  <th className="p-3">Pós</th>
                  <th className="p-3">Diferença</th>
                  <th className="p-3">Atividades</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((a) => {
                  const dif = a.pre && a.pos ? a.pos.pontos - a.pre.pontos : null
                  return (
                    <tr key={a.nome} className="border-t-2 border-ceu-100">
                      <td className="p-3 font-bold">{a.nome}</td>
                      <td className="p-3">{a.ano ? `${a.ano}º` : '—'}</td>
                      <td className="p-3">{a.pre ? `${a.pre.pontos}/${a.pre.maximo}` : '—'}</td>
                      <td className="p-3">{a.pos ? `${a.pos.pontos}/${a.pos.maximo}` : '—'}</td>
                      <td
                        className={cn(
                          'p-3 font-bold',
                          dif === null ? 'text-tinta-400' : dif > 0 ? 'text-folha-600' : 'text-tinta-600',
                        )}
                      >
                        {dif === null ? '—' : dif > 0 ? `+${dif}` : dif}
                      </td>
                      <td className="p-3">{Object.keys(a.progresso).length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="rounded-bolha bg-sol-100 p-4 text-sm text-sol-600">
          <strong>Os dados ficam só neste computador.</strong> Não há servidor nem envio pela
          internet. Exporte o CSV e guarde em local seguro — são dados de crianças, protegidos pela
          LGPD.
        </p>
      </main>
    </div>
  )
}
