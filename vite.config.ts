import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  define: {
    'process.env': {}
  }, // Crucial para que funcione con file:///
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'next/link': path.resolve(__dirname, './src/next_mocks/link.tsx'),
      'next/image': path.resolve(__dirname, './src/next_mocks/image.tsx'),
      'next/navigation': path.resolve(__dirname, './src/next_mocks/navigation.tsx'),
      'next/font/google': path.resolve(__dirname, './src/next_mocks/font.ts')
    }
  }
})
