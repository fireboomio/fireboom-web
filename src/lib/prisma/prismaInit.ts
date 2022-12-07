import { wireTmGrammars } from 'monaco-editor-textmate'
import { Registry } from 'monaco-textmate' // peer dependency
import { loadWASM } from 'onigasm' // peer dependency of 'monaco-textmate'

export default async function init(monaco: any, editor: any) {
  await loadWASM('/modules/prisma/onigasm.wasm') // See https://www.npmjs.com/package/onigasm#light-it-up

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

  const theme = await (await fetch(`/modules/prisma/theme-monaco.json`)).json()
  // monaco's built-in themes aren't powereful enough to handle TM tokens
  // https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter#monaco-vscode-textmate-theme-converter
  monaco.editor.defineTheme('prisma-theme', theme)
  monaco.editor.setTheme('prisma-theme')

  await wireTmGrammars(monaco, registry, grammars, editor)
}
