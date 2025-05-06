import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    // Generate sourcemaps for better debugging
    sourcemap: true,
    // Output directory (default is already 'dist')
    outDir: 'dist'
  },
  // Base public path when served in production
  base: '/'
})
