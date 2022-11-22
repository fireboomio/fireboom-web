/* eslint-disable @typescript-eslint/no-unsafe-call */
import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, type PluginOption } from 'vite'
import vitePluginImp from 'vite-plugin-imp'
import Pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'
import { visualizer } from 'rollup-plugin-visualizer'
import { argv } from 'process'

// const backendUrl = 'http://120.26.62.151:9123'
// const backendUrl = 'http://192.168.166.143:9123'
// const backendUrl = 'http://8.142.115.204:9123'
// const backendUrl = 'http://192.168.201.147:9123'
const backendUrl = process.env.SERVER_URL || 'http://localhost:9123'

const plugins: PluginOption[] = [
  react(),
  vitePluginImp({
    libList: [
      {
        libName: 'antd',
        style: name => `antd/es/${name}/style/index.js`
      }
    ]
  }),
  WindiCSS(),
  Pages({
    extensions: ['tsx'],
    exclude: ['**/components/**/*.*', '**/blocks/**/*.*', '**/hooks/**/*.*', '**/_*.*'],
    routeStyle: 'next',
    importMode: 'async',
    dirs: 'src/pages',
    onRoutesGenerated: routes => {
      // 数据建模支持id参数
      const modeling = routes
        .find(route => route.path === 'workbench')
        .children.find((route: { path: string }) => route.path === 'modeling')
      const newRoute = modeling.children.find((route: { path: string }) => route.path === '')
      newRoute.path = ':id'
      modeling.children.push(newRoute)
      return routes
    }
  })
]
if (argv[2] === 'build' && argv[3] === '--' && argv[4] === 'report') {
  plugins.push(visualizer())
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
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
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '@antv/x6',
        replacement: '@antv/x6/dist/x6.js'
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
