import Editor, { loader } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import type { DMFResp } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'

interface Props {
  dbId: number
  current: string
  onChange?: (value: string) => void
}

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })
const ModelEditor = ({ current, dbId, onChange }: Props) => {
  const editorRef = useRef<any>()

  const [value, setValue] = useState<string>('')
  useEffect(() => {
    void requests.get<unknown, DMFResp>(`/prisma/dmf/${dbId ?? ''}`).then(x => {
      setValue(x.schemaContent)
      if (editorRef.current) {
        editorRef.current.setValue(x.schemaContent)
        onChange?.(x.schemaContent)
      }
    })
  }, [dbId])
  return (
    <div className="h-full bg-red">
      <Editor
        defaultLanguage="prisma"
        onMount={editor => (editorRef.current = editor)}
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
