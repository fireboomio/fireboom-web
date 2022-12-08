/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2022 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import 'monaco-editor/esm/vs/editor/editor.all.js'
// support all editor features
import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/quickInput/standaloneQuickInputService.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch.js'
import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast.js'

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import { buildWorkerDefinition } from 'monaco-editor-workers'
import type { MessageTransports } from 'monaco-languageclient'
import {
  CloseAction,
  ErrorAction,
  MonacoLanguageClient,
  MonacoServices
} from 'monaco-languageclient'
import getMessageServiceOverride from 'vscode/service-override/messages'
import { StandaloneServices } from 'vscode/services'
import {
  BrowserMessageReader,
  BrowserMessageWriter
} from 'vscode-languageserver-protocol/browser.js'

StandaloneServices.initialize({
  ...getMessageServiceOverride(document.body)
})

buildWorkerDefinition('modules/monaco-workers', new URL('', window.location.href).href, false)

// register Monaco languages
monaco.languages.register({
  id: 'prisma',
  extensions: ['.prisma'],
  aliases: ['PRISMA', 'prisma']
  // mimetypes: ['text/plain']
})

function createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
  return new MonacoLanguageClient({
    name: 'Sample Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: [{ language: 'prisma' }],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart })
      }
    },
    // create a language client connection to the server running in the web worker
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports)
      }
    }
  })
}

// install Monaco language client services
MonacoServices.install()

const serverModule = new URL('/modules/prisma/server-es.js', window.location.href).href
// const serverModule = new URL('/src/lib/prisma/server.ts', window.location.href).href

const worker = new Worker(serverModule, {
  type: 'module'
})
const reader = new BrowserMessageReader(worker)
const writer = new BrowserMessageWriter(worker)
const languageClient = createLanguageClient({ reader, writer })
languageClient.start()

reader.onClose(() => languageClient.stop())
