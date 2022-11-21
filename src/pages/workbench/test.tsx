import Editor, { loader, useMonaco } from '@monaco-editor/react'
import { useRef } from 'react'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })
export default function MyGraphQLIDE() {
  const editorRef = useRef<any>(null)
  const modelRef = useRef<any>(null)
  const monaco = useMonaco()
  return (
    <Editor
      defaultLanguage="json"
      defaultPath="http://myserver/foo-schema.json"
      beforeMount={monaco => {
        var jsonCode = ['{', '    "p1": "v3",', '    "p2": false', '}'].join('\n')
        var modelUri = monaco.Uri.parse('http://myserver/foo-schema.json') // a made up unique URI for our model
        console.log(modelUri)
        modelRef.current = monaco.editor.createModel(jsonCode, 'json', modelUri)
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: [
            {
              uri: 'http://myserver/foo-schema.json', // id of the first schema
              fileMatch: [modelUri.toString()], // associate with our model
              schema: {
                type: 'object',
                properties: {
                  p1: {
                    enum: ['v1', 'v2']
                  },
                  p2: {
                    $ref: 'http://myserver/bar-schema.json' // reference the second schema
                  }
                }
              }
            },
            {
              uri: 'http://myserver/bar-schema.json', // id of the second schema
              schema: {
                type: 'object',
                properties: {
                  q1: {
                    enum: ['x1', 'x2']
                  }
                }
              }
            }
          ]
        })
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
