import Editor, { loader } from '@monaco-editor/react'
import { useRef } from 'react'

import { setupSchema } from '@/lib/helpers/jsonManage'

// import testData from './testdata'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export default function MyGraphQLIDE() {
  const editorRef = useRef<any>(null)
  const modelRef = useRef<any>(null)

  console.log('****')
  return (
    <Editor
      defaultLanguage="json"
      defaultPath="test.json"
      beforeMount={monaco => {
        setupSchema(
          monaco,
          'test.json',
          {
            type: 'object',
            properties: {
              p1: {
                enum: ['v1', 'v2']
              }
            }
          },
          JSON.stringify({ a: 1 }, null, 2)
        )
      }}
      onMount={editor => {
        // editor.setModel(modelRef.current)
        editorRef.current = editor
        // editor.onKeyUp(e => {
        //   const position = editor.getPosition()
        //   const text = editor.getModel().getLineContent(position.lineNumber).trim()
        //   if (e.keyCode === monaco?.KeyCode.Enter && !text) {
        //     editor.trigger('', 'editor.action.triggerSuggest', '')
        //   }
        // })
      }}
      // defaultValue={value}
      onChange={value => {
        // setValue(value ?? '')
        // onChange?.(value ?? '')
      }}
    />
  )
}
