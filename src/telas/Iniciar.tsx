import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Botao } from '@/design/Botao'
import { usarPerfil } from '@/store/usarPerfil'
import { narrar } from '@/lib/narracao'
// Importado, não escrito como caminho: o app é servido sob /saude-em-jogo/
// no GitHub Pages, e um "/marca/..." absoluto aponta para fora da base —
// o logo dava 404 no site publicado. O import deixa o Vite resolver.
import logoVertical from '@/assets/marca/logo-vertical.png'

/** Tela 1 do mockup: a marca e um único botão, INICIAR. */
export function Iniciar() {
  const navegar = useNavigate()
  const perfil = usarPerfil((e) => e.perfil)
  const pre = usarPerfil((e) => e.pre)
  const trocarDeAluno = usarPerfil((e) => e.trocarDeAluno)
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  function comecar() {
    // Primeiro toque do usuário: é aqui que o navegador libera o TTS.
    if (narracaoLigada) narrar('Saúde em jogo!')

    if (!perfil.nome) {
      navegar('/nome')
      return
    }
    // O pré vem antes de qualquer jogo: respondido depois de jogar, ele mede
    // a intervenção em vez de medir o ponto de partida.
    navegar(pre ? '/menu' : '/questionario/pre')
  }

  return (
    <div className="fundo-ceu flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <motion.img
        src={logoVertical}
        alt="Saúde em Jogo! Jogo que ensina, saúde que transforma!"
        className="w-full max-w-sm"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <Botao cor="folha" tamanho="grande" onClick={comecar}>
          {perfil.nome ? `Continuar, ${perfil.nome}!` : 'INICIAR'}
        </Botao>

        {/* O laboratório tem poucos computadores e a turma inteira passa por
            eles. Sem esta saída, o segundo aluno joga dentro do perfil do
            primeiro e a pesquisa atribui tudo a um nome só. */}
        {perfil.nome && (
          <button
            type="button"
            onClick={() => {
              trocarDeAluno()
              navegar('/nome')
            }}
            className="min-h-toque px-4 font-display text-lg font-bold text-ceu-600 underline"
          >
            Não sou eu — trocar de aluno
          </button>
        )}
      </motion.div>

      <p className="max-w-md text-center text-sm text-tinta-400">
        Letramento corporal e promoção da saúde nas aulas de Educação Física
      </p>
    </div>
  )
}
