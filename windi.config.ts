import { defineConfig } from 'windicss/helpers'
import lineClampPlugin from 'windicss/plugin/line-clamp'

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
      },
      fontFamily: {
        mono: ['Source Code Pro', 'Andale Mono WT', 'Andale Mono', 'Menlo', 'Lucida Console', 'Lucida Sans Typewriter', 'Monaco', 'monospace']
      }
    }
  },
    plugins: [
      lineClampPlugin
    ],
})
