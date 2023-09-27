import { wireTmGrammars } from 'monaco-editor-textmate'
import { Registry } from 'monaco-textmate' // peer dependency
import { loadWASM } from 'onigasm'

let firstInit = true

export default async function init(monaco: any, editor: any) {
  if (firstInit) {
    firstInit = false
    await loadWASM(import.meta.env.BASE_URL + 'modules/prisma/onigasm.wasm') // See https://www.npmjs.com/package/onigasm#light-it-up
  }

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      return {
        format: 'json',
        content: await (
          await fetch(`${import.meta.env.BASE_URL}modules/prisma/prisma.tmLanguage.json`)
        ).json()
      }
    }
  })
  const grammars = new Map()
  grammars.set('prisma', 'source.prisma')

  const theme = await (
    await fetch(`${import.meta.env.BASE_URL}modules/prisma/light-monaco.json`)
  ).json()
  // monaco's built-in themes aren't powereful enough to handle TM tokens
  // https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter#monaco-vscode-textmate-theme-converter
  monaco.editor.defineTheme('prisma-theme', theme)
  monaco.editor.setTheme('prisma-theme')
  window['reloadPrisma'] = () => {
    wireTmGrammars(monaco, registry, grammars, editor)
  }
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
