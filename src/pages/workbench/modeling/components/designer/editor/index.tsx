import Editor, { loader } from '@monaco-editor/react'
import { useEffect, useRef, useState } from 'react'

import useCurrentEntity from '@/lib/hooks/useCurrentEntity'

interface Props {
  dbId: number
  current: string
  onChange?: (value: string) => void
  defaultContent: string
}

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })
const ModelEditor = ({ current, dbId, onChange, defaultContent }: Props) => {
  const editorRef = useRef<any>()

  const [value, setValue] = useState<string>('')
  const { currentEntity, changeToEntityById } = useCurrentEntity()
  useEffect(() => {
    // void requests.get<unknown, DMFResp>(`/prisma/dmf/${dbId ?? ''}`).then(x => {
    //   setValue(x.schemaContent)
    //   if (editorRef.current) {
    //     editorRef.current.setValue(x.schemaContent)
    //     onChange?.(x.schemaContent)
    //   }
    // })
  }, [dbId])
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
        defaultLanguage="prisma"
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
