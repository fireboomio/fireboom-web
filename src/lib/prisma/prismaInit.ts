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
  console.log('monaco', monaco)
  console.log('editor', editor)
  console.log('registry', registry)
  console.log('grammars', grammars)

  editor.onKeyUp((e: { keyCode: number }) => {
    // 按下回车时触发ai
    if (e.keyCode === 3) {
      const { lineNumber } = editor.getPosition()
      const content = editor.getModel().getLineContent(lineNumber - 1)
      const match = content.match(/^\s*\/\/\s*[qQ]:(.*)$/)
      if (match?.[1]) {
        const question = match[1].trim()
        editor.executeEdits('', [
          {
            range: new monaco.Range(lineNumber, 1, lineNumber, 1),
            text:
              `//[${question}]的提示内容，第1行\n//[${question}]的提示内容，第2行\n//[${question}]的提示内容，第3行` +
              `\n// ai end`
          }
        ])
      }
    }
  })

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
