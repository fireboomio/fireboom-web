import axios from 'axios'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

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

export type Language = 'prisma' | 'typescript'

const createPrompt = {
  prisma: '后续问题请使用prisma代码回答，符合prisma规范，包含表和字段注释',
  typeScript: '后续问题请使用typeScript代码回答，符合typeScript语法，包含代码和注释'
}
const optimizePrompt = {
  prisma:
    '请根据后续要求优化下列代码，输出内容需要保持完整，未优化部分也要原样回传。请使用prisma代码回答，符合prisma规范，包含表和字段注释',
  typeScript:
    '请根据后续要求优化下列代码，输出内容需要保持完整，未优化部分也要原样回传。使用typeScript代码回答，符合typeScript语法，包含代码和注释'
}

async function getSuggestion(question: string, language: Language, currentCode?: string) {
  let questionRow = question
  if (currentCode) {
    questionRow = questionRow + ',其他内容不变'
  }
  if (language === 'prisma') {
    questionRow = questionRow + ',不要使用外键'
  }
  const result = await axios.post('http://8.142.115.204:9801/ai', {
    messages: [
      {
        role: 'user',
        content: currentCode
          ? optimizePrompt[language] + `\n\`\`\`\n${currentCode}\n\`\`\``
          : createPrompt[language]
      },
      {
        role: 'user',
        content: questionRow
      }
    ]
  })
  const message = result?.data?.[0]?.message
  const answer = message?.content ?? ''
  let inCode = false
  const codeLines = answer.split('\n').filter((x: string) => {
    if (x.startsWith('```')) {
      inCode = !inCode
      return false
    }
    return inCode
  })
  return codeLines.join('\n')
}

// 定位问题所在位置
function locationQuestion(
  editor: monaco.editor.IStandaloneCodeEditor,
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
  if (questionLine !== undefined) {
    return new monaco.Range(questionLine + 2, 1, endLine ? endLine + 2 : questionLine + 2, 1)
  }
}

function insert(
  editor: monaco.editor.IStandaloneCodeEditor,
  content: string,
  question: string,
  questionIndex: number
) {
  const range = locationQuestion(editor, question, questionIndex)
  if (range === undefined) {
    return
  }
  editor.executeEdits('', [
    {
      range: range,
      text: content
    }
  ])
}

export async function triggerAI(
  editor: monaco.editor.IStandaloneCodeEditor,
  lineNumber: number,
  language: Language,
  optimize: boolean = false
) {
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

    // 获取当前代码内容
    let currentCode = ''
    if (optimize) {
      const currentCodeRange = locationQuestion(editor, question, questionIndex)
      if (currentCodeRange) {
        // 修正范围，去掉ai end标记
        currentCodeRange.setEndPosition(currentCodeRange.endLineNumber - 1, 1)
        currentCode = editor.getModel()?.getValueInRange?.(currentCodeRange) ?? ''
      }
      if (!currentCode) {
        console.error('未找到当前代码内容')
        return
      }
    }

    insert(editor, '\n// 正在询问AI，请稍后...' + '\n' + END_MARK, question, questionIndex)
    let suggestion = ''
    if (optimize) {
      suggestion = await getSuggestion(question, language, currentCode)
    } else {
      suggestion = await getSuggestion(question, language)
    }
    const addContent = suggestion + '\n' + END_MARK
    insert(editor, addContent, question, questionIndex)
  }
}

export function setUp(editor: monaco.editor.IStandaloneCodeEditor, language: Language) {
  editor.onKeyUp(async (e: { keyCode: number }) => {
    // 按下回车时触发ai
    if (e.keyCode === 3) {
      const { lineNumber } = editor.getPosition() || {}
      if (lineNumber === undefined) {
        return
      }
      await triggerAI(editor, lineNumber - 1, language)
    }
  })
}
