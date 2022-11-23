import Editor, { loader } from '@monaco-editor/react'
import { buildSchema, parse } from 'graphql'
import { collectVariables, getVariablesJSONSchema } from 'graphql-language-service'
import { useEffect, useRef } from 'react'

import { schemaFetcher } from '@/lib/helpers/gqlSchema'
import { useJSONManage } from '@/lib/helpers/jsonManage'

// import testData from './testdata'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export default function MyGraphQLIDE() {
  const editorRef = useRef<any>(null)
  const modelRef = useRef<any>(null)
  const { setupSchema } = useJSONManage()

  useEffect(() => {
//     const gqlSchema = buildSchema(testData)
//     const variablesToType = collectVariables(
//       gqlSchema,
//       parse(`mutation DeleteOnePost($id: Int!) @rbac(requireMatchAll: [code, user]) {
//   data: lll_deleteOnePost(where: {id: $id}) {
//     id
//   }
// }`)
//     )
//     const jsonSchema = getVariablesJSONSchema(variablesToType)
//     // const JSONSchema6Result = getVariablesJSONSchema(variablesToType, schema)
//   }, [])
//
//   console.log(
//     schemaFetcher.loadSchema().then(schema => {
//       // const JSONSchema6Result = getVariablesJSONSchema(variablesToType, schema)
//       // console.log('JSONSchema6Result', JSONSchema6Result)
//     })
  )})
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
const startChar = 'a'
const endChars = ['b', 'c', 'd'].join('')
const pattern = new RegExp(`${startChar}([^${startChar + endChars}]*)[${endChars}]`, 'g')
const str = `axxxxxbxxx
axxxxxcxxx
axxxxxdxxx
axxxxxbxxxcxxx`

for (const match of str.matchAll(pattern)) {
  console.log(match)
}
