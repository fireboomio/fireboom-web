import 'process'

import type {
  CodeActionParams,
  CompletionItem,
  CompletionParams,
  Connection,
  DeclarationParams,
  Diagnostic,
  DocumentFormattingParams,
  DocumentSymbolParams,
  HoverParams,
  InitializeParams,
  InitializeResult,
  RenameParams
} from 'vscode-languageserver'
import {
  CodeActionKind,
  DidChangeConfigurationNotification,
  TextDocuments
} from 'vscode-languageserver'
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection
} from 'vscode-languageserver/browser.js'
import { TextDocument } from 'vscode-languageserver-textdocument'

import * as MessageHandler from './MessageHandler'
import * as util from './prisma-fmt/util'
import type { LSOptions, LSSettings } from './settings'

declare const self: any
function getConnection(options?: LSOptions): Connection {
  /* browser specific setup code */

  const messageReader = new BrowserMessageReader(self)
  const messageWriter = new BrowserMessageWriter(self)

  return createConnection(messageReader, messageWriter)
}

let hasCodeActionLiteralsCapability = false
let hasConfigurationCapability = false

startServer()
/**
 * Starts the language server.
 *
 * @param options Options to customize behavior
 */
export function startServer(options?: LSOptions): void {
  // Source code: https://github.com/microsoft/vscode-languageserver-node/blob/main/server/src/common/server.ts#L1044
  const connection: Connection = getConnection(options)

  console.log = connection.console.log.bind(connection.console)
  console.error = connection.console.error.bind(connection.console)

  const documents = new TextDocuments<TextDocument>(TextDocument)

  connection.onInitialize((params: InitializeParams) => {
    // Logging first...
    connection.console.info(`Default version of Prisma 'prisma-fmt': ${util.getVersion()}`)

    const prismaEnginesVersion = util.getEnginesVersion()
    connection.console.info(`Prisma Engines version: ${prismaEnginesVersion}`)
    const prismaCliVersion = util.getCliVersion()
    connection.console.info(`Prisma CLI version: ${prismaCliVersion}`)

    // ... and then capabilities of the language server
    const capabilities = params.capabilities

    hasCodeActionLiteralsCapability = Boolean(
      capabilities?.textDocument?.codeAction?.codeActionLiteralSupport
    )
    hasConfigurationCapability = Boolean(capabilities?.workspace?.configuration)

    const result: InitializeResult = {
      capabilities: {
        definitionProvider: true,
        documentFormattingProvider: true,
        completionProvider: {
          resolveProvider: true,
          triggerCharacters: ['@', '"', '.']
        },
        hoverProvider: true,
        renameProvider: true,
        documentSymbolProvider: true
      }
    }

    if (hasCodeActionLiteralsCapability) {
      result.capabilities.codeActionProvider = {
        codeActionKinds: [CodeActionKind.QuickFix]
      }
    }

    return result
  })

  connection.onInitialized(() => {
    if (hasConfigurationCapability) {
      // Register for all configuration changes.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      connection.client.register(DidChangeConfigurationNotification.type, undefined)
    }
  })

  // The global settings, used when the `workspace/configuration` request is not supported by the client or is not set by the user.
  // This does not apply to VSCode, as this client supports this setting.
  // const defaultSettings: LSSettings = {}
  // let globalSettings: LSSettings = defaultSettings // eslint-disable-line

  // Cache the settings of all open documents
  const documentSettings: Map<string, Thenable<LSSettings>> = new Map<
    string,
    Thenable<LSSettings>
  >()

  // eslint-disable-line @typescript-eslint/no-unused-vars
  connection.onDidChangeConfiguration(change => {
    connection.console.info('Configuration changed.')
    if (hasConfigurationCapability) {
      // Reset all cached document settings
      documentSettings.clear()
    } else {
      // globalSettings = <LSSettings>(change.settings.prisma || defaultSettings) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    }

    // Revalidate all open prisma schemas
    documents.all().forEach(validateTextDocument) // eslint-disable-line @typescript-eslint/no-misused-promises
  })

  // Only keep settings for open documents
  documents.onDidClose(e => {
    documentSettings.delete(e.document.uri)
  })

  // function getDocumentSettings(resource: string): Thenable<LSSettings> {
  //   if (!hasConfigurationCapability) {
  //     connection.console.info(
  //       `hasConfigurationCapability === false. Defaults will be used.`,
  //     )
  //     return Promise.resolve(globalSettings)
  //   }

  //   let result = documentSettings.get(resource)
  //   if (!result) {
  //     result = connection.workspace.getConfiguration({
  //       scopeUri: resource,
  //       section: 'prisma',
  //     })
  //     documentSettings.set(resource, result)
  //   }
  //   return result
  // }

  function validateTextDocument(textDocument: TextDocument) {
    const diagnostics: Diagnostic[] = MessageHandler.handleDiagnosticsRequest(
      textDocument,
      (errorMessage: string) => {
        connection.window.showErrorMessage(errorMessage)
      }
    )
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics })
  }

  documents.onDidChangeContent((change: { document: TextDocument }) => {
    validateTextDocument(change.document)
  })

  function getDocument(uri: string): TextDocument | undefined {
    return documents.get(uri)
  }

  connection.onDefinition((params: DeclarationParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      return MessageHandler.handleDefinitionRequest(doc, params)
    }
  })

  connection.onCompletion((params: CompletionParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      const result = MessageHandler.handleCompletionRequest(params, doc)
      return result
    }
  })

  // This handler resolves additional information for the item selected in the completion list.
  connection.onCompletionResolve((completionItem: CompletionItem) => {
    return MessageHandler.handleCompletionResolveRequest(completionItem)
  })

  // Unused now
  // TODO remove or experiment new file watcher
  connection.onDidChangeWatchedFiles(() => {
    // Monitored files have changed in VS Code
    connection.console.log(`Types have changed. Sending request to restart TS Language Server.`)
    // Restart TS Language Server
    connection.sendNotification('prisma/didChangeWatchedFiles', {})
  })

  connection.onHover((params: HoverParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      return MessageHandler.handleHoverRequest(doc, params)
    }
  })

  connection.onDocumentFormatting((params: DocumentFormattingParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      return MessageHandler.handleDocumentFormatting(params, doc, (errorMessage: string) => {
        connection.window.showErrorMessage(errorMessage)
      })
    }
  })

  connection.onCodeAction((params: CodeActionParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      return MessageHandler.handleCodeActions(params, doc)
    }
  })

  connection.onRenameRequest((params: RenameParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      return MessageHandler.handleRenameRequest(params, doc)
    }
  })

  connection.onDocumentSymbol((params: DocumentSymbolParams) => {
    const doc = getDocument(params.textDocument.uri)
    if (doc) {
      return MessageHandler.handleDocumentSymbol(params, doc)
    }
  })

  // Make the text document manager listen on the connection
  // for open, change and close text document events
  documents.listen(connection)

  connection.listen()
}