import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'
import * as path from 'path'

export default defineConfig({
  base:    "/react-obj",
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
})
