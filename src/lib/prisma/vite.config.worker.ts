/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import path from 'path'
import { defineConfig } from 'vite'

const config = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, './server.ts'),
      name: 'server',
      fileName: format => `server-${format}.js`,
      formats: ['es']
    },
    outDir: '../../../public/modules/prisma',
    emptyOutDir: false
  },
  resolve: {
    alias: [
      {
        find: '@prisma/prisma-fmt-wasm',
        replacement: path.resolve(__dirname, './@prisma/prisma-fmt-wasm')
      }
    ]
  }
})

export default config
