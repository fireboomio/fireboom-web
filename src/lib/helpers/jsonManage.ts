import type { Monaco } from '@monaco-editor/react'

export function setupSchema(monaco: Monaco, name: string, schema: any, content: string = '') {
  if (!monaco) return false
  console.log(arguments, 123123)
  const uri = monaco.Uri.parse(name)
  // 如果已经有重名model则释放
  monaco.editor.getModel(uri)?.dispose()
  // 创建model
  monaco.editor.createModel(content, 'json', monaco.Uri.parse(name))
  // 设置schema
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    // validateVariablesJSON:[],
    validate: true,
    schemas: [{ uri: name, fileMatch: [uri.toString()], schema }]
  })
}
