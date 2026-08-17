import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { usarPerfil } from '@/store/usarPerfil'
import { Moldura } from './Moldura'
import { Iniciar } from '@/telas/Iniciar'
import { Nome } from '@/telas/Nome'
import { Menu } from '@/telas/Menu'
import { Atividades } from '@/telas/Atividades'
import { AtividadesDoAno } from '@/telas/AtividadesDoAno'
import { JogosDeMovimento } from '@/telas/JogosDeMovimento'
import { DesafiosDaSaude } from '@/telas/DesafiosDaSaude'
import { DicasDeSaude } from '@/telas/DicasDeSaude'
import { MinhasConquistas } from '@/telas/MinhasConquistas'
import { Jogo } from '@/telas/Jogo'
import { Questionario } from '@/telas/Questionario'
import { Professor } from '@/telas/Professor'

export function App() {
  const carregar = usarPerfil((e) => e.carregar)
  const carregado = usarPerfil((e) => e.carregado)

  useEffect(() => {
    void carregar()
  }, [carregar])

  if (!carregado) return <TelaDeEspera />

  return (
    // HashRouter: o app roda instalado como PWA e, no plano B, direto de
    // uma pasta local no laboratório. Rotas com hash funcionam nos dois
    // casos sem exigir configuração de servidor.
    <HashRouter>
      <Routes>
        <Route path="/" element={<Iniciar />} />
        <Route path="/nome" element={<Nome />} />
        <Route element={<Moldura />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/atividades" element={<Atividades />} />
          <Route path="/atividades/:ano" element={<AtividadesDoAno />} />
          <Route path="/movimento" element={<JogosDeMovimento />} />
          <Route path="/desafios" element={<DesafiosDaSaude />} />
          <Route path="/dicas" element={<DicasDeSaude />} />
          <Route path="/conquistas" element={<MinhasConquistas />} />
        </Route>
        <Route path="/jogo/:atividadeId" element={<Jogo />} />
        <Route path="/questionario/:momento" element={<Questionario />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

function TelaDeEspera() {
  return (
    <div className="fundo-ceu flex min-h-dvh items-center justify-center">
      <p className="sr-only">Carregando</p>
    </div>
  )
}
