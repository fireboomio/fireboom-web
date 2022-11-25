// import '@/monaco-prisma'

import Editor, { loader } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import useCurrentEntity from '@/lib/hooks/useCurrentEntity'

interface Props {
  onChange?: (value: string) => void
  defaultContent: string
}

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })
const ModelEditor = ({ onChange, defaultContent }: Props) => {
  const editorRef = useRef<any>()

  const [value, setValue] = useState<string>('')
  const { currentEntity } = useCurrentEntity()
  const lastScrollEntity = useRef<string>('')
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
    // console.log('====', defaultContent)
    setValue(defaultContent)
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
        beforeMount={monaco => {
          console.log(monaco.languages.prisma)
        }}
        onMount={editor => {
          editorRef.current = editor
          editorRef.current.setValue(defaultContent)
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
