import type { DadosDoAluno } from '@/dominio/aluno'
import { CATALOGO } from '@/dominio/catalogo'
import type { ConteudoQuestionario } from '@/content/questionario/schema'

/**
 * Exportação CSV para a análise da dissertação.
 *
 * Uma linha por aluno, com pré, pós, diferença e o progresso em cada atividade.
 * É a única saída de dados do app — não há backend, e ela só acontece quando a
 * professora clica.
 */

/** Escapa um campo. Ponto e vírgula é o separador por causa do Excel em pt-BR. */
function campo(valor: string | number | undefined | null): string {
  const texto = valor === undefined || valor === null ? '' : String(valor)
  return /[";\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto
}

export function csvDosAlunos(
  alunos: Record<string, DadosDoAluno>,
  questionario: ConteudoQuestionario,
): string {
  const atividades = CATALOGO.filter((a) => a.disponivel)

  const cabecalho = [
    'nome',
    'ano',
    'pre_pontos',
    'pre_maximo',
    'pre_data',
    'pos_pontos',
    'pos_maximo',
    'pos_data',
    'diferenca',
    ...questionario.perguntas.flatMap((p) => [`pre_${p.id}`, `pos_${p.id}`]),
    ...atividades.map((a) => `estrelas_${a.id}`),
    'atividades_concluidas',
    'figurinhas',
    'atualizado_em',
  ]

  const linhas = Object.values(alunos)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    .map((aluno) => {
      const diferenca =
        aluno.pre && aluno.pos ? aluno.pos.pontos - aluno.pre.pontos : undefined

      return [
        aluno.nome,
        aluno.ano ?? '',
        aluno.pre?.pontos,
        aluno.pre?.maximo,
        aluno.pre?.respondidoEm,
        aluno.pos?.pontos,
        aluno.pos?.maximo,
        aluno.pos?.respondidoEm,
        diferenca,
        ...questionario.perguntas.flatMap((p) => [
          aluno.pre?.respostas[p.id],
          aluno.pos?.respostas[p.id],
        ]),
        ...atividades.map((a) => aluno.progresso[a.id]?.estrelas ?? 0),
        Object.keys(aluno.progresso).length,
        aluno.figurinhas.length,
        aluno.atualizadoEm,
      ].map(campo)
    })

  return [cabecalho.join(';'), ...linhas.map((l) => l.join(';'))].join('\r\n') + '\r\n'
}

/**
 * Dispara o download do CSV.
 *
 * O BOM não é enfeite: sem ele o Excel em português abre o arquivo em ANSI e
 * "Ação", "café" e todo nome com acento chegam corrompidos na análise.
 */
export function baixarCsv(nomeDoArquivo: string, conteudo: string) {
  const blob = new Blob(['﻿' + conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeDoArquivo
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
