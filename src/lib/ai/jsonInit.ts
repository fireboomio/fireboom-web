import type { Monaco } from '@monaco-editor/react'
import type { editor, IDisposable } from 'monaco-editor'

const defaultSchema =
  '{\n  "type": "object",\n  "properties": {\n    "postId": {\n      "type": "string"\n    }\n  }\n}'
let lastRegister: IDisposable
export default function (monaco: Monaco) {
  if (lastRegister) {
    lastRegister.dispose()
  }
  class InlineCompleter {
    async provideInlineCompletions(model: editor.ITextModel) {
      if (model.uri.path === '/profile.json') {
        await new Promise(resolve => setTimeout(resolve, 100))
        if (!model.getValue()) {
          return {
            items: [
              {
                insertText: defaultSchema
              }
            ]
          }
        }
      }
    }

    freeInlineCompletions() {}
  }

  lastRegister = monaco.languages.registerInlineCompletionsProvider('json', new InlineCompleter())
}
