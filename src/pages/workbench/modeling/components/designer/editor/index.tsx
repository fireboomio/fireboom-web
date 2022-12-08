import '@/lib/prisma/client'

import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useEffect, useRef, useState } from 'react'

import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import init from '@/lib/prisma/prismaInit'

interface Props {
  onChange?: (value: string) => void
  onUpdateValidate?: (flag: boolean) => void
  defaultContent: string
}

loader.config({ monaco })
const ModelEditor = ({ onChange, defaultContent, onUpdateValidate }: Props) => {
  const editorRef = useRef<any>()

  const [value, setValue] = useState<string>('')
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
    setValue(defaultContent)
    defaultRef.current = defaultContent
    if (editorRef.current) {
      if (editorRef.current.getValue() !== defaultContent) {
        editorRef.current.setValue(defaultContent)
      }
    }
  }, [defaultContent])
  return (
    <div className="h-full bg-red">
      <Editor
        language="prisma"
        defaultLanguage="prisma"
        onValidate={markers => {
          onUpdateValidate?.(!markers.length)
        }}
        beforeMount={monaco => {
          // console.log(monaco.languages.prisma)
        }}
        onMount={editor => {
          init(monaco, editor)
          editorRef.current = editor
          editorRef.current.setValue(defaultRef.current)
          // editor.onKeyUp(e => {
          //   if (isInputKey(e.keyCode)) {
          //     editor.trigger('', 'editor.action.triggerSuggest', '')
          //   }
          // })
        }}
        defaultValue={value}
        onChange={value => {
          setValue(value ?? '')
          onChange?.(value ?? '')
        }}
      />
    </div>
  )
}

export default ModelEditor
