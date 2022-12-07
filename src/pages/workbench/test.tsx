import '@/lib/prisma/client'

import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useRef } from 'react'

import init from '@/lib/prisma/prismaInit'
// import testData from './testdata'

loader.config({ monaco })

export default function MyGraphQLIDE() {
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<any>(null)

  return (
    <Editor
      defaultLanguage="prisma"
      beforeMount={monaco => {
        monacoRef.current = monaco
      }}
      onMount={editor => {
        init(monacoRef.current, editor)
        editorRef.current = editor
        // editor.onKeyUp(e => {
        //   if (isInputKey(e.keyCode)) {
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
