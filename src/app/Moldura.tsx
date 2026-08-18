import { useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { usarPerfil, totalDeEstrelas } from '@/store/usarPerfil'
import { Estrela } from '@/design/Estrela'
import { calar } from '@/lib/narracao'
// Ver comentário em Iniciar.tsx: caminho absoluto quebra sob a base do Pages.
import logoHorizontal from '@/assets/marca/logo-horizontal.png'

/** Moldura das telas internas: voltar, marca, contador de estrelas. */
export function Moldura() {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const perfil = usarPerfil((e) => e.perfil)
  const progresso = usarPerfil((e) => e.progresso)
  const estrelas = totalDeEstrelas(progresso)
  const toqueLongo = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const noMenu = pathname === '/menu'

  return (
    <div className="fundo-ceu flex min-h-dvh flex-col">
      <header className="flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3">
        {!noMenu && (
          <button
            onClick={() => {
              calar()
              navegar(-1)
            }}
            aria-label="Voltar"
            className="grid size-toque place-items-center rounded-full border-b-[5px] border-ceu-600 bg-ceu-400 text-white transition-all active:translate-y-[5px] active:border-b-0"
          >
            <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Toque longo no logo abre a Área do Professor.
            Fica escondido de propósito: um botão visível na barra seria
            clicado por criança de 7 anos no primeiro minuto de aula. */}
        <Link
          to="/menu"
          className="shrink-0"
          aria-label="Início"
          onPointerDown={() => {
            toqueLongo.current = setTimeout(() => navegar('/professor'), 1500)
          }}
          onPointerUp={() => clearTimeout(toqueLongo.current)}
          onPointerLeave={() => clearTimeout(toqueLongo.current)}
        >
          <img
            src={logoHorizontal}
            alt="Saúde em Jogo!"
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {perfil.nome && (
            <span className="hidden font-display text-xl font-bold text-tinta-600 sm:inline">
              {perfil.nome}
            </span>
          )}
          <Link
            to="/conquistas"
            className="flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow-flutuante"
            aria-label={`${estrelas} estrelas conquistadas. Ver minhas conquistas.`}
          >
            <Estrela cheia className="h-8 w-8" />
            <span className="font-display text-2xl font-extrabold text-sol-600">{estrelas}</span>
          </Link>
        </div>
      </header>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mx-auto w-full max-w-5xl flex-1 px-4 pb-6 sm:px-8 sm:pb-8"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}
