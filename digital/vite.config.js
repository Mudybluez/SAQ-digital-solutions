import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    historyApiFallback: true,
  },

  preview: {
    port: 5174,
  },

  build: {
    // Inline small assets as base64 instead of extra requests
    assetsInlineLimit: 4096,

    // Rollup manual chunks — split vendor libs into separate cached files
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/'))
            return 'vendor-react'
          if (id.includes('node_modules/framer-motion'))
            return 'vendor-motion'
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run'))
            return 'vendor-router'
          if (id.includes('node_modules/lucide-react'))
            return 'vendor-lucide'
        },
      },
    },
  },
})
