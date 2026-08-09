import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Botao } from '@/design/Botao'
import { usarPerfil } from '@/store/usarPerfil'
import { narrar } from '@/lib/narracao'

/** Tela 1 do mockup: a marca e um único botão, INICIAR. */
export function Iniciar() {
  const navegar = useNavigate()
  const perfil = usarPerfil((e) => e.perfil)
  const narracaoLigada = usarPerfil((e) => e.preferencias.narracao)

  function comecar() {
    // Primeiro toque do usuário: é aqui que o navegador libera o TTS.
    if (narracaoLigada) narrar('Saúde em jogo!')
    navegar(perfil.nome ? '/menu' : '/nome')
  }

  return (
    <div className="fundo-ceu flex min-h-dvh flex-col items-center justify-center gap-10 px-6">
      <motion.img
        src="/marca/logo-vertical.png"
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
      >
        <Botao cor="folha" tamanho="grande" onClick={comecar}>
          {perfil.nome ? `Continuar, ${perfil.nome}!` : 'INICIAR'}
        </Botao>
      </motion.div>

      <p className="max-w-md text-center text-sm text-tinta-400">
        Letramento corporal e promoção da saúde nas aulas de Educação Física
      </p>
    </div>
  )
}
