import type { editor } from 'monaco-editor'

import type { Language } from '@/lib/ai/index'
import { matchQuestion, triggerAI } from '@/lib/ai/index'

export function registerCodeLens(
  monaco: any,
  editor: editor.IStandaloneCodeEditor,
  language: Language
) {
  const commandId1 = editor.addCommand(0, function (_: unknown, lineNumber: number) {
    triggerAI(editor, lineNumber, language)
  })
  const commandId2 = editor.addCommand(0, function (_: unknown, lineNumber: number) {
    triggerAI(editor, lineNumber, language, true)
  })

  return monaco.languages.registerCodeLensProvider(language, {
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
