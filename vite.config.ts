/* eslint-disable @typescript-eslint/no-unsafe-call */
import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, type PluginOption } from 'vite'
import Pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'
import { visualizer } from 'rollup-plugin-visualizer'
import { argv } from 'process'
import pkg from './package.json'

// const backendUrl = 'http://120.26.62.151:9123'
// const backendUrl = 'http://192.168.166.143:9123'
// const backendUrl = 'http://8.142.115.204:9123'
// const backendUrl = 'http://192.168.202.98:9123'
const backendUrl = process.env.SERVER_URL || 'http://localhost:9123'

const plugins: PluginOption[] = [
  react({
    babel: {
      plugins: [
        [
          'formatjs',
          {
            idInterpolationPattern: '[sha512:contenthash:base64:6]',
            ast: true
          }
        ]
      ]
    }
  }),
  // vitePluginImp({
  //   libList: [
  //     {
  //       libName: 'antd',
  //       style: name => `antd/es/${name}/style/index.js`
  //     }
  //   ]
  // }),
  WindiCSS(),
  Pages({
    extensions: ['tsx'],
    exclude: ['**/components/**/*.*', '**/blocks/**/*.*', '**/hooks/**/*.*', '**/_*.*'],
    routeStyle: 'next',
    importMode: 'async',
    dirs: 'src/pages'
  })
]
if (argv[2] === 'build' && argv[3] === '--' && argv[4] === 'report') {
  plugins.push(visualizer())
}

process.env.VITE_FB_VERSION = pkg.version

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '^/auth/cookie': {
        target: backendUrl,
        changeOrigin: true
      },
      '^/app/main': {
        target: backendUrl,
        changeOrigin: true
      },
      '^/api/v1': {
        target: backendUrl,
        changeOrigin: true
      },
      '^/app': {
        target: backendUrl,
        changeOrigin: true
      },
      '^/upload': {
        target: backendUrl,
        changeOrigin: true
      },
      '^/d': {
        target: backendUrl,
        changeOrigin: true
      },
      '^/ws': {
        target: backendUrl,
        ws: true,
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      sass: {
        includePaths: [path.join(__dirname, 'src/styles')]
      },
      less: {
        // globalVars: {},
        modifyVars: {
          'primary-color': '#E92E5E'
        },
        javascriptEnabled: true
      }
    }
  },
  resolve: {
    alias: [
      { find: 'path', replacement: 'rollup-plugin-node-polyfills/polyfills/path' },
      { find: 'os', replacement: 'rollup-plugin-node-polyfills/polyfills/os' },
      { find: 'util', replacement: 'rollup-plugin-node-polyfills/polyfills/util' },
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '@antv/x6',
        replacement: '@antv/x6/dist/x6.js'
      },
      {
        find: '@prisma/prisma-fmt-wasm',
        replacement: './src/lib/prisma/@prisma/prisma-fmt-wasm'
      }
      //  {
      //     find: '@antv/x6-react-shape',
      //     replacement: '@antv/x6-react-shape/dist/x6-react-shape.js',
      //   }
    ]
  },
  plugins,
  build: {
    minify: 'esbuild'
  },
  experimental: {},
  optimizeDeps: {
    include: [
      'antd',
      'axios',
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet',
      'use-immer'
    ]
  }
  // optimizeDeps: {
  //   exclude: ['@antv/x6-react-shape']
  // }
})
