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
  typescript: '后续问题请使用typeScript代码回答，符合typeScript语法，包含代码和注释'
}
const optimizePrompt = {
  prisma:
    '请根据后续要求优化下列代码，输出内容需要保持完整，未优化部分也要原样回传。请使用prisma代码回答，符合prisma规范，包含表和字段注释',
  typescript:
    '请根据后续要求优化下列代码，输出内容需要保持完整，未优化部分也要原样回传。使用typeScript代码回答，符合typeScript语法，包含代码和注释'
}

function startPrint(editor: monaco.editor.IStandaloneCodeEditor, _range: monaco.Range) {
  let isInCodeBlock = false
  let backticksCount = 0
  let isLineStart = true
  let isFirstChar = true
  let range = _range

  function type(char: string) {
    editor.executeEdits('', [{ range: range, text: char }])
    if (char === '\n') {
      range = new monaco.Range(range.startLineNumber + 1, 1, range.endLineNumber + 1, 1)
    } else {
      range = new monaco.Range(
        range.startLineNumber,
        range.startColumn + char.length,
        range.endLineNumber,
        range.endColumn + char.length
      )
    }
  }

  return function (str: string) {
    if (isFirstChar) {
      isFirstChar = false
      if (str[0] !== '`') {
        type('// ')
      }
    }
    for (let i = 0; i < str.length; i++) {
      const char = str[i]
      if (char === '`' && isLineStart) {
        backticksCount++
        if (backticksCount === 3) {
          isInCodeBlock = !isInCodeBlock
        }
        continue
      }
      backticksCount = 0
      if (char === '\n') {
        type(char)
        if (!isInCodeBlock) {
          type('// ')
        }
        isLineStart = true
      } else {
        if (!isInCodeBlock && range.startColumn >= 60) {
          console.log(isInCodeBlock, range.startColumn)
          type('\n')
          type('// ')
        }
        type(char)
        isLineStart = false
      }
    }
  }
}

async function getSuggestion(
  question: string,
  language: Language,
  editor: monaco.editor.IStandaloneCodeEditor,
  range: monaco.IRange,
  currentCode?: string
) {
  let questionRow = question
  if (currentCode) {
    questionRow = questionRow + ',其他内容不变'
  }

  const print = startPrint(editor, range)
  const response = await fetch('https://fb-node-server.onrender.com/ai_stream', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
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
  })
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const msgs: string[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    // 处理接收到的数据
    const str = decoder.decode(value)
    str
      .split('\n')
      .map((x: string) => x.trim())
      .filter(Boolean)
      .forEach((x: string) => {
        const row = x.substring(6)
        try {
          if (row === '[DONE]') {
            // 结束
          } else {
            const data = JSON.parse(row)
            if (data?.choices?.[0]?.delta?.content) {
              const content = data.choices[0].delta.content
              print(content)
              msgs.push(content)
            }
          }
        } catch (e) {
          console.error(e)
        }
      })
  }
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

    const range = locationQuestion(editor, question, questionIndex)
    if (!range) {
      return
    }
    editor.executeEdits('', [
      {
        range: range,
        text: '\n' + END_MARK
      }
    ])

    const keyUpListener = editor.onKeyUp(e => {
      e.preventDefault()
    })
    const keyDownListener = editor.onKeyDown(e => {
      e.preventDefault()
    })
    try {
      if (optimize) {
        await getSuggestion(question, language, editor, range, currentCode)
      } else {
        await getSuggestion(question, language, editor, range)
      }
    } catch (e) {
      console.error(e)
    }

    keyUpListener.dispose()
    keyDownListener.dispose()
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
