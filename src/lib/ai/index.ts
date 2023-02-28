import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

import requests from '../fetchers'

const REGEX_QUESTION = /^\s*\/\/\s*[qQ]:(.*)$/
const END_MARK = '// ai end\n'
const REGEX_END = /^\s*\/\/\s*ai end/

export function matchQuestion(line: string) {
  const match = line.match(REGEX_QUESTION)
  return match?.[1]?.trim()
}
function matchEndMark(line: string) {
  return !!line.match(REGEX_END)
}

async function getSuggestion(question: string) {
  const data = await requests.post<unknown, { code: string }[]>('/ai/prisma', { prompt: question })
  return data?.[0]?.code ?? ''
}

function insert(
  editor: monaco.editor.IStandaloneCodeEditor,
  content: string,
  question: string,
  questionIndex: number
) {
  const model = editor.getModel()
  if (!model) {
    console.error('未获取到model')
    return
  }
  const lines = model.getLinesContent()
  let questionLine: number | undefined
  let endLine: number | undefined
  let matchCount = 0
  lines.find((line, index) => {
    if (questionLine === undefined) {
      // 寻找问题行号
      const matched = matchQuestion(line)
      if (matched === question) {
        if (matchCount === questionIndex) {
          questionLine = index
        }
        matchCount++
      }
    } else {
      // 找到问题行号后，尝试寻找ai end标记
      const isEndMark = matchEndMark(line)
      if (isEndMark) {
        endLine = index
        return true
      }
    }
  })

  if (questionLine === undefined) {
    console.error('未匹配到问题所在行')
    return
  }
  editor.executeEdits('', [
    {
      range: new monaco.Range(questionLine + 2, 1, endLine ? endLine + 2 : questionLine + 2, 1),
      text: content
    }
  ])
}

export async function triggerAI(editor: monaco.editor.IStandaloneCodeEditor, lineNumber: number) {
  const model = editor.getModel()
  if (!model) {
    return
  }
  const content = model.getLineContent(lineNumber)
  const question = matchQuestion(content)
  if (question) {
    // 记录当前操作的是该问题在内容中第几次出现，用于后续插入提示时的定位
    let count = 0
    let questionIndex = 0
    model.getLinesContent().forEach((line, index) => {
      const matched = matchQuestion(line)
      if (matched === question) {
        if (lineNumber - 1 === index) {
          questionIndex = count
        }
        count++
      }
    })

    const suggestion = await getSuggestion(question)
    const addContent = suggestion + '\n' + END_MARK
    insert(editor, addContent, question, questionIndex)
  }
}

export function setUp(editor: monaco.editor.IStandaloneCodeEditor) {
  editor.onKeyUp(async (e: { keyCode: number }) => {
    // 按下回车时触发ai
    if (e.keyCode === 3) {
      const { lineNumber } = editor.getPosition() || {}
      if (lineNumber === undefined) {
        return
      }
      await triggerAI(editor, lineNumber - 1)
    }
  })
}
