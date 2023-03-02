import type { editor } from 'monaco-editor'
import { wireTmGrammars } from 'monaco-editor-textmate'
import { Registry } from 'monaco-textmate' // peer dependency
import { loadWASM } from 'onigasm'

import { matchQuestion, triggerAI } from '@/lib/ai' // peer dependency of 'monaco-textmate'

let firstInit = true

export default async function init(monaco: any, editor: any) {
  if (firstInit) {
    await loadWASM('/modules/prisma/onigasm.wasm') // See https://www.npmjs.com/package/onigasm#light-it-up
    firstInit = false
  }

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      return {
        format: 'json',
        content: await (await fetch(`/modules/prisma/prisma.tmLanguage.json`)).json()
      }
    }
  })
  const grammars = new Map()
  grammars.set('prisma', 'source.prisma')

  const theme = await (await fetch(`/modules/prisma/light-monaco.json`)).json()
  // monaco's built-in themes aren't powereful enough to handle TM tokens
  // https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter#monaco-vscode-textmate-theme-converter
  monaco.editor.defineTheme('prisma-theme', theme)
  monaco.editor.setTheme('prisma-theme')
  await wireTmGrammars(monaco, registry, grammars, editor)

  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    await wireTmGrammars(monaco, registry, grammars, editor)

    await new Promise(resolve => setTimeout(resolve, 1000))
    await wireTmGrammars(monaco, registry, grammars, editor)

    await new Promise(resolve => setTimeout(resolve, 2000))
    await wireTmGrammars(monaco, registry, grammars, editor)

    await new Promise(resolve => setTimeout(resolve, 5000))
    await wireTmGrammars(monaco, registry, grammars, editor)
  } catch (_) {
    // ignore
  }
}

export function registerCodeLens(monaco: any, editor: editor.IStandaloneCodeEditor) {
  const commandId1 = editor.addCommand(0, function (_: unknown, lineNumber: number) {
    triggerAI(editor, lineNumber, 'prisma')
  })
  const commandId2 = editor.addCommand(0, function (_: unknown, lineNumber: number) {
    triggerAI(editor, lineNumber, 'prisma', true)
  })
  return monaco.languages.registerCodeLensProvider('prisma', {
    provideCodeLenses: function (model: any) {
      const lines = model.getLinesContent()
      const codeLens: any = []
      lines.forEach((line: string, index: number) => {
        const question = matchQuestion(line)
        if (question) {
          codeLens.push({
            range: {
              startLineNumber: index + 1,
              startColumn: 1,
              endLineNumber: index + 1,
              endColumn: 1
            },
            id: 'ai',
            command: {
              id: commandId1,
              title: 'AI生成',
              arguments: [index + 1]
            }
          })
          codeLens.push({
            range: {
              startLineNumber: index + 1,
              startColumn: 1,
              endLineNumber: index + 1,
              endColumn: 1
            },
            id: 'ai2',
            command: {
              id: commandId2,
              title: 'AI优化',
              arguments: [index + 1]
            }
          })
        }
      })
      return {
        lenses: codeLens,
        dispose: () => {}
      }
    }
  })
}
