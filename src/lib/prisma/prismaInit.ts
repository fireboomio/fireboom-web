import { wireTmGrammars } from 'monaco-editor-textmate'
import { Registry } from 'monaco-textmate' // peer dependency
import { loadWASM } from 'onigasm' // peer dependency of 'monaco-textmate'

let firstInit = true

export default async function init(monaco: any, editor: any) {
  console.log('prisma高亮——开始执行')
  if (firstInit) {
    await loadWASM('/modules/prisma/onigasm.wasm') // See https://www.npmjs.com/package/onigasm#light-it-up
    firstInit = false
  }
  console.log('prisma高亮——wasm加载完毕')

  const registry = new Registry({
    getGrammarDefinition: async scopeName => {
      return {
        format: 'json',
        content: await (await fetch(`/modules/prisma/prisma.tmLanguage.json`)).json()
      }
    }
  })
  console.log('prisma高亮——prisma词法定义加载完毕')
  const grammars = new Map()
  grammars.set('prisma', 'source.prisma')

  const theme = await (await fetch(`/modules/prisma/light-monaco.json`)).json()
  console.log('prisma高亮——prisma主题加载完毕')
  // monaco's built-in themes aren't powereful enough to handle TM tokens
  // https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter#monaco-vscode-textmate-theme-converter
  monaco.editor.defineTheme('prisma-theme', theme)
  monaco.editor.setTheme('prisma-theme')
  console.log('prisma高亮——prisma主题设置完毕')

  await wireTmGrammars(monaco, registry, grammars, editor)
  console.log('prisma高亮——完成')
}
