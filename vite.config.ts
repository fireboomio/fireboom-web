/* eslint-disable @typescript-eslint/no-unsafe-call */
import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'
import Pages from 'vite-plugin-pages'
import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '^/api/v1/schemas': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      },
      '^/api/v1/sources': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true
      },
      '^/api/v1': {
        // target: 'http://120.26.62.151:9123',
        target: 'http://192.168.166.143:9123',
        changeOrigin: true
      },
      '^/app': {
        target: 'http://120.26.62.151:9991',
        // target: 'http://192.168.166.143:9123',
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
  plugins: [
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
      dirs: 'src/pages'
    })
  ]
  // optimizeDeps: {
  //   exclude: ['@antv/x6-react-shape']
  // }
})
