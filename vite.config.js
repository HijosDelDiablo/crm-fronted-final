import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: process.env.PORT || 2000,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: process.env.PORT || 2000,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Aumentar límite de advertencia a 1000KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunk para React y sus dependencias principales
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'react-vendor';
          }
          
          // Chunk para UI libraries
          if (id.includes('react-bootstrap') || id.includes('bootstrap') || 
              id.includes('lucide-react') || id.includes('framer-motion')) {
            return 'ui-vendor';
          }
          
          // Chunk para utilidades y helpers
          if (id.includes('axios') || id.includes('redux') || id.includes('@reduxjs/toolkit')) {
            return 'utils-vendor';
          }
          
          // Chunk para funcionalidades específicas
          if (id.includes('lightweight-charts')) {
            return 'charts-vendor';
          }
          
          if (id.includes('react-markdown') || id.includes('rehype-highlight') || id.includes('remark-gfm')) {
            return 'markdown-vendor';
          }
          
          // Chunk para PWA
          if (id.includes('vite-plugin-pwa') || id.includes('workbox')) {
            return 'pwa-vendor';
          }
          
          // Chunk para páginas específicas
          if (id.includes('/src/pages/AdminModules/') || id.includes('/src/pages/admin/')) {
            return 'admin-pages';
          }
          
          if (id.includes('/src/pages/Client/') || id.includes('/src/pages/client/')) {
            return 'client-pages';
          }
          
          // Chunk para APIs
          if (id.includes('/src/api/') || id.includes('/src/services/')) {
            return 'api-layer';
          }
          
          // Chunk para componentes compartidos
          if (id.includes('/src/components/shared/') || id.includes('/src/components/common/')) {
            return 'shared-components';
          }
          
          // Otros node_modules van a vendor
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Autobots',
      short_name: 'Agencia Autobots',
      description: 'La mejor agencia de autos',
      theme_color: '#ffffff',

      "icons": [
        {
          "src": "/logo/windows11/SmallTile.scale-100.png",
          "sizes": "71x71"
        },
        {
          "src": "./logo/windows11/SmallTile.scale-125.png",
          "sizes": "89x89"
        },
        {
          "src": "./logo/windows11/SmallTile.scale-150.png",
          "sizes": "107x107"
        },
        {
          "src": "./logo/windows11/SmallTile.scale-200.png",
          "sizes": "142x142"
        },
        {
          "src": "./logo/windows11/SmallTile.scale-400.png",
          "sizes": "284x284"
        },
        {
          "src": "./logo/windows11/Square150x150Logo.scale-100.png",
          "sizes": "150x150"
        },
        {
          "src": "./logo/windows11/Square150x150Logo.scale-125.png",
          "sizes": "188x188"
        },
        {
          "src": "./logo/windows11/Square150x150Logo.scale-150.png",
          "sizes": "225x225"
        },
        {
          "src": "./logo/windows11/Square150x150Logo.scale-200.png",
          "sizes": "300x300"
        },
        {
          "src": "./logo/windows11/Square150x150Logo.scale-400.png",
          "sizes": "600x600"
        },
        {
          "src": "./logo/windows11/Wide310x150Logo.scale-100.png",
          "sizes": "310x150"
        },
        {
          "src": "./logo/windows11/Wide310x150Logo.scale-125.png",
          "sizes": "388x188"
        },
        {
          "src": "./logo/windows11/Wide310x150Logo.scale-150.png",
          "sizes": "465x225"
        },
        {
          "src": "./logo/windows11/Wide310x150Logo.scale-200.png",
          "sizes": "620x300"
        },
        {
          "src": "./logo/windows11/Wide310x150Logo.scale-400.png",
          "sizes": "1240x600"
        },
        {
          "src": "./logo/windows11/LargeTile.scale-100.png",
          "sizes": "310x310"
        },
        {
          "src": "./logo/windows11/LargeTile.scale-125.png",
          "sizes": "388x388"
        },
        {
          "src": "./logo/windows11/LargeTile.scale-150.png",
          "sizes": "465x465"
        },
        {
          "src": "./logo/windows11/LargeTile.scale-200.png",
          "sizes": "620x620"
        },
        {
          "src": "./logo/windows11/LargeTile.scale-400.png",
          "sizes": "1240x1240"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.scale-100.png",
          "sizes": "44x44"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.scale-125.png",
          "sizes": "55x55"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.scale-150.png",
          "sizes": "66x66"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.scale-200.png",
          "sizes": "88x88"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.scale-400.png",
          "sizes": "176x176"
        },
        {
          "src": "./logo/windows11/StoreLogo.scale-100.png",
          "sizes": "50x50"
        },
        {
          "src": "./logo/windows11/StoreLogo.scale-125.png",
          "sizes": "63x63"
        },
        {
          "src": "./logo/windows11/StoreLogo.scale-150.png",
          "sizes": "75x75"
        },
        {
          "src": "./logo/windows11/StoreLogo.scale-200.png",
          "sizes": "100x100"
        },
        {
          "src": "./logo/windows11/StoreLogo.scale-400.png",
          "sizes": "200x200"
        },
        {
          "src": "./logo/windows11/SplashScreen.scale-100.png",
          "sizes": "620x300"
        },
        {
          "src": "./logo/windows11/SplashScreen.scale-125.png",
          "sizes": "775x375"
        },
        {
          "src": "./logo/windows11/SplashScreen.scale-150.png",
          "sizes": "930x450"
        },
        {
          "src": "./logo/windows11/SplashScreen.scale-200.png",
          "sizes": "1240x600"
        },
        {
          "src": "./logo/windows11/SplashScreen.scale-400.png",
          "sizes": "2480x1200"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-16.png",
          "sizes": "16x16"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-20.png",
          "sizes": "20x20"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-24.png",
          "sizes": "24x24"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-30.png",
          "sizes": "30x30"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-32.png",
          "sizes": "32x32"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-36.png",
          "sizes": "36x36"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-40.png",
          "sizes": "40x40"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-44.png",
          "sizes": "44x44"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-48.png",
          "sizes": "48x48"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-60.png",
          "sizes": "60x60"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-64.png",
          "sizes": "64x64"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-72.png",
          "sizes": "72x72"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-80.png",
          "sizes": "80x80"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-96.png",
          "sizes": "96x96"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.targetsize-256.png",
          "sizes": "256x256"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
          "sizes": "16x16"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
          "sizes": "20x20"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
          "sizes": "24x24"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
          "sizes": "30x30"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
          "sizes": "32x32"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
          "sizes": "36x36"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
          "sizes": "40x40"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
          "sizes": "44x44"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
          "sizes": "48x48"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
          "sizes": "60x60"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
          "sizes": "64x64"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
          "sizes": "72x72"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
          "sizes": "80x80"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
          "sizes": "96x96"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
          "sizes": "256x256"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
          "sizes": "16x16"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
          "sizes": "20x20"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
          "sizes": "24x24"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
          "sizes": "30x30"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
          "sizes": "32x32"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
          "sizes": "36x36"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
          "sizes": "40x40"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
          "sizes": "44x44"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
          "sizes": "48x48"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
          "sizes": "60x60"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
          "sizes": "64x64"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
          "sizes": "72x72"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
          "sizes": "80x80"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
          "sizes": "96x96"
        },
        {
          "src": "./logo/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
          "sizes": "256x256"
        },
        {
          "src": "./logo/android/android-launchericon-512-512.png",
          "sizes": "512x512"
        },
        {
          "src": "./logo/./logo/android/android-launchericon-192-192.png",
          "sizes": "192x192"
        },
        {
          "src": "./logo/android/android-launchericon-144-144.png",
          "sizes": "144x144"
        },
        {
          "src": "./logo/android/android-launchericon-96-96.png",
          "sizes": "96x96"
        },
        {
          "src": "./logo/android/android-launchericon-72-72.png",
          "sizes": "72x72"
        },
        {
          "src": "./logo/android/android-launchericon-48-48.png",
          "sizes": "48x48"
        },
        {
          "src": "./logo/ios/16.png",
          "sizes": "16x16"
        },
        {
          "src": "./logo/ios/20.png",
          "sizes": "20x20"
        },
        {
          "src": "./logo/ios/29.png",
          "sizes": "29x29"
        },
        {
          "src": "./logo/ios/32.png",
          "sizes": "32x32"
        },
        {
          "src": "./logo/ios/40.png",
          "sizes": "40x40"
        },
        {
          "src": "./logo/ios/50.png",
          "sizes": "50x50"
        },
        {
          "src": "./logo/ios/57.png",
          "sizes": "57x57"
        },
        {
          "src": "./logo/ios/58.png",
          "sizes": "58x58"
        },
        {
          "src": "./logo/ios/60.png",
          "sizes": "60x60"
        },
        {
          "src": "./logo/ios/64.png",
          "sizes": "64x64"
        },
        {
          "src": "./logo/ios/72.png",
          "sizes": "72x72"
        },
        {
          "src": "./logo/ios/76.png",
          "sizes": "76x76"
        },
        {
          "src": "./logo/ios/80.png",
          "sizes": "80x80"
        },
        {
          "src": "./logo/ios/87.png",
          "sizes": "87x87"
        },
        {
          "src": "./logo/ios/100.png",
          "sizes": "100x100"
        },
        {
          "src": "./logo/ios/114.png",
          "sizes": "114x114"
        },
        {
          "src": "./logo/ios/120.png",
          "sizes": "120x120"
        },
        {
          "src": "./logo/ios/128.png",
          "sizes": "128x128"
        },
        {
          "src": "./logo/ios/144.png",
          "sizes": "144x144"
        },
        {
          "src": "./logo/ios/152.png",
          "sizes": "152x152"
        },
        {
          "src": "./logo/ios/167.png",
          "sizes": "167x167"
        },
        {
          "src": "./logo/ios/180.png",
          "sizes": "180x180"
        },
        {
          "src": "./logo/ios/192.png",
          "sizes": "192x192"
        },
        {
          "src": "./logo/ios/256.png",
          "sizes": "256x256"
        },
        {
          "src": "./logo/ios/512.png",
          "sizes": "512x512"
        },
        {
          "src": "./logo/ios/1024.png",
          "sizes": "1024x1024"
        }
      ]
      ,
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})