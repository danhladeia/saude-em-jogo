import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { CATALOGO, TITULO_DO_ANO } from '@/dominio/catalogo'
import { usarPerfil, totalDeEstrelas } from '@/store/usarPerfil'
import { Estrela, FileiraDeEstrelas } from '@/design/Estrela'
import { Mascote } from '@/design/Mascote'
import { Botao } from '@/design/Botao'
import { Album } from '@/design/Album'
import { sequenciaVisivel } from '@/lib/dias'
import type { Ano } from '@/dominio/tipos'

/** Tela 8 do mockup: as estrelas do aluno, com o nome dele no topo. */
export function MinhasConquistas() {
  const nome = usarPerfil((e) => e.perfil.nome)
  const progresso = usarPerfil((e) => e.progresso)
  const figurinhas = usarPerfil((e) => e.figurinhas)
  const sequencia = usarPerfil((e) => e.sequencia)
  const estrelas = totalDeEstrelas(progresso)
  const diasSeguidos = sequenciaVisivel(sequencia)

  const concluidas = CATALOGO.filter((a) => progresso[a.id])

  return (
    <div className="flex flex-col gap-6 py-4">
      <h1 className="text-4xl uppercase text-sol-600">Minhas Conquistas</h1>

      <div className="flex items-center gap-5 rounded-bolha bg-white p-6 shadow-flutuante">
        <Mascote humor={estrelas > 0 ? 'comemorando' : 'feliz'} className="h-28" />
        <div>
          <p className="font-display text-3xl font-extrabold">{nome || 'Aluno'}</p>
          <p className="flex items-center gap-2 text-2xl font-bold text-sol-600">
            <Estrela cheia className="h-9 w-9" />
            {estrelas} {estrelas === 1 ? 'estrela' : 'estrelas'}
          </p>
          <p className="mt-1 text-tinta-400">
            {concluidas.length} de {CATALOGO.length} atividades concluídas
          </p>
          {diasSeguidos > 0 && (
            <p className="mt-1 font-display text-lg font-bold text-coral-500">
              🔥 {diasSeguidos} {diasSeguidos === 1 ? 'dia seguido' : 'dias seguidos'}
            </p>
          )}
        </div>
      </div>

      <Album coletadas={figurinhas} />

      <p className="rounded-bolha bg-sol-100 p-4 text-center font-display text-lg font-bold text-sol-600">
        Cada desafio cumprido ganha uma estrela ⭐
      </p>

      {concluidas.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-bolha border-4 border-dashed border-ceu-200 p-10 text-center">
          <p className="text-xl text-tinta-600">
            Você ainda não tem estrelas. Que tal começar por uma atividade?
          </p>
          <Link to="/atividades">
            <Botao cor="ceu" tamanho="grande">
              Ver atividades
            </Botao>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {concluidas.map((atividade, i) => {
            const registro = progresso[atividade.id]
            return (
              <motion.li
                key={atividade.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-bolha border-4 border-ceu-100 bg-white px-5 py-4"
              >
                <div className="flex-1">
                  <p className="font-display text-xl font-bold">{atividade.jogo}</p>
                  <p className="text-sm text-tinta-400">
                    {atividade.ano}º ano — {TITULO_DO_ANO[atividade.ano as Ano]}
                  </p>
                </div>
                <FileiraDeEstrelas ganhas={registro.estrelas} />
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
