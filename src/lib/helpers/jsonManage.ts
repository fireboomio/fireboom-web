import type { Monaco } from '@monaco-editor/react'

export function setupSchema(monaco: Monaco, name: string, schema: any, content: string = '') {
  if (!monaco) return false
  console.log(arguments, 123123)
  const uri = monaco.Uri.parse(name)
  // 如果已经有重名model则释放
  monaco.editor.getModel(uri)?.dispose()
  // 创建model
  monaco.editor.createModel(content, 'json', uri)
  // 设置schema
  console.log(schema, 123123)
  // 因为monaco目前不支持jsonSchema 2020-12，指定后会导致lint失效，因此这里移除Schema版本
  delete schema.$schema
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    // validateVariablesJSON:[],
    validate: true,
    schemas: [{ uri: name, fileMatch: [uri.toString()], schema }]
  })
}
