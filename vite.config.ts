import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/saude-em-jogo/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      workbox: {
        // Tudo no precache. Arte e narracao nao sao enfeite aqui: sem o
        // personagem o app fica com imagem quebrada, e sem audio a turma de
        // 1o ano nao consegue ler o enunciado. Os dois precisam sobreviver
        // ao laboratorio sem internet.
        //
        // NAO usar runtimeCaching com padrao /assets/library/: o Vite move e
        // renomeia os assets para /assets/<nome>-<hash>.webp no build, entao
        // uma regra baseada no caminho do codigo-fonte nunca casa e a arte
        // fica de fora do cache sem nenhum aviso.
        globPatterns: ['**/*.{js,css,html,svg,woff2,mp3,webp,png}', 'falas/manifesto.json'],
        // O limite padrao (2 MiB) e por arquivo e sobra para sprite e clipe.
        // O detector de pose e a excecao a regra do "tudo no precache":
        // sao ~17 MB entre WASM e modelo, e escola sem webcam nenhuma
        // baixaria tudo isso para nunca usar. Fica fora do precache e e
        // buscado na primeira vez que uma crianca abre um bloco de
        // movimento com verificacao; dai em diante sai do cache.
        globIgnores: ['**/pose/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/pose/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'pose-v1',
              expiration: { maxEntries: 8 },
              cacheableResponse: { statuses: [0, 200] },
              rangeRequests: true,
            },
          },
        ],
      },
      manifest: {
        name: 'Saúde em Jogo!',
        short_name: 'Saúde em Jogo',
        description: 'Jogo que ensina, saúde que transforma! Letramento corporal e promoção da saúde para os anos iniciais.',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '/saude-em-jogo/',
        scope: '/saude-em-jogo/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#F4FBFF',
        theme_color: '#4FC3F7',
        categories: ['education', 'kids', 'health'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
