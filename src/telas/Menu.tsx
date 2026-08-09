import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { usarPerfil } from '@/store/usarPerfil'
import { Mascote } from '@/design/Mascote'
import { cn } from '@/design/cn'

interface Opcao {
  para: string
  rotulo: string
  descricao: string
  cor: string
  icone: string
}

/** Tela 3 do mockup: as cinco seções, na mesma ordem. */
const OPCOES: Opcao[] = [
  {
    para: '/atividades',
    rotulo: 'Atividades',
    descricao: 'As aulas do seu ano',
    cor: 'bg-ceu-400 border-ceu-600',
    icone: '🎯',
  },
  {
    para: '/movimento',
    rotulo: 'Jogos de Movimento',
    descricao: 'Alongamentos e movimentos',
    cor: 'bg-folha-400 border-folha-600',
    icone: '🤸',
  },
  {
    para: '/desafios',
    rotulo: 'Desafios da Saúde',
    descricao: 'Diários e semanais',
    cor: 'bg-coral-400 border-coral-600',
    icone: '💪',
  },
  {
    para: '/dicas',
    rotulo: 'Dicas de Saúde',
    descricao: 'Higiene, alimentação, sono e movimento',
    cor: 'bg-uva-400 border-uva-600',
    icone: '💡',
  },
  {
    para: '/conquistas',
    rotulo: 'Minhas Conquistas',
    descricao: 'Suas estrelas',
    cor: 'bg-sol-400 border-sol-600',
    icone: '⭐',
  },
]

export function Menu() {
  const nome = usarPerfil((e) => e.perfil.nome)

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center gap-4">
        <Mascote humor="feliz" className="h-24" />
        <div>
          <h1 className="text-3xl text-ceu-600">Oi, {nome || 'amigo'}!</h1>
          <p className="text-lg text-tinta-600">Escolha uma opção</p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {OPCOES.map((opcao, i) => (
          <motion.li
            key={opcao.para}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={i === 0 ? 'sm:col-span-2' : undefined}
          >
            <Link
              to={opcao.para}
              className={cn(
                'flex min-h-[6rem] w-full items-center gap-5 rounded-bolha border-b-[6px] px-6 py-4 text-white',
                'transition-all duration-100 ease-pulo active:translate-y-[6px] active:border-b-0',
                opcao.cor,
              )}
            >
              <span aria-hidden="true" className="text-5xl">
                {opcao.icone}
              </span>
              <span className="flex flex-col">
                <span className="font-display text-2xl font-extrabold uppercase leading-tight">
                  {opcao.rotulo}
                </span>
                <span className="text-base font-medium opacity-90">{opcao.descricao}</span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
