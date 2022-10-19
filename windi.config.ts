import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  extract: {
    include: ['src/**/*.{jsx,tsx,css}'],
    exclude: ['node_modules', '.git', 'dist'],
  },
  theme: {
    extend: {
      colors: {
        primary: '#E92E5E',
        default: '#333'
      }
    }
  }
})
