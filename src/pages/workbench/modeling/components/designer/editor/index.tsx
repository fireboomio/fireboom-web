import '@/lib/prisma/client'

import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import type { MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'

import { setUp } from '@/lib/ai'
import { registerCodeLens } from '@/lib/ai/codelens'
import { makeSuggest } from '@/lib/helpers/utils'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import init from '@/lib/prisma/prismaInit'

interface Props {
  onChange?: (value: string) => void
  onUpdateValidate?: (flag: boolean) => void
  defaultContent: string
  actionRef?: MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>
  onReady?: () => void
}

loader.config({ monaco })
const ModelEditor = ({ onChange, defaultContent, onUpdateValidate, actionRef, onReady }: Props) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()
  const { currentEntity } = useCurrentEntity()
  const lastScrollEntity = useRef<string>('')
  // 用于当editor初始化未完成时记录defaultContent
  const defaultRef = useRef<string>('')
  useEffect(() => {
    if (!currentEntity) return
    const key = `${currentEntity.type}_${currentEntity.id}`
    if (lastScrollEntity.current === key) {
      return
    }
    lastScrollEntity.current = key
    // 滚动到当前entity
    if (editorRef.current) {
      const targetRow = editorRef.current
        .getValue()
        .split('\n')
        .findIndex(
          (line: string) =>
            !!line.match(new RegExp(`${currentEntity.type}\\s+${currentEntity.name}\\s+\\{`))
        )
      editorRef.current.revealLineInCenter(targetRow)
    }
  }, [currentEntity])
  useEffect(() => {
    onChange?.(defaultContent)
    defaultRef.current = defaultContent
    if (editorRef.current) {
      editorRef.current.setValue(defaultContent)
    }
  }, [defaultContent])
  const codeLensRef = useRef<any>()
  useEffect(() => {
    return () => {
      codeLensRef.current?.dispose()
    }
  }, [])
  return (
    <div className="h-full bg-red">
      <Editor
        language="prisma"
        defaultLanguage="prisma"
        options={{
          autoClosingBrackets: 'always'
        }}
        onValidate={markers => {
          onUpdateValidate?.(!markers.length)
        }}
        beforeMount={monaco => {
          // console.log(monaco.languages.prisma)
        }}
        onMount={(editor, monaco) => {
          console.log('prisma editor mounted', editor, monaco)
          init(monaco, editor)
          codeLensRef.current = registerCodeLens(monaco, editor, 'prisma')
          setUp(editor, 'prisma')
          if (actionRef) {
            actionRef.current = editor
          }
          editorRef.current = editor
          editorRef.current.setValue(defaultRef.current)
          makeSuggest(editor)
          onReady?.()
        }}
        defaultValue={defaultRef.current}
        onChange={value => {
          onChange?.(value ?? '')
        }}
      />
    </div>
  )
}

export default ModelEditor
