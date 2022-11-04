import type { Monaco } from '@swordjs/monaco-editor-react'

import requests, { NPM_RESOLVE_HOSE } from '@/lib/fetchers'

export async function dependLoader(name: string, version: string, monaco: Monaco) {
  const result = await requests.get<
    unknown,
    { types: string; dependencies: Record<string, string>; dtsFiles: Record<string, string> }
  >(`${NPM_RESOLVE_HOSE}/loadPkgTypes`, {
    params: { name, version },
    timeout: 60000
  })

  Object.keys(result.dtsFiles).forEach(key => {
    inject(monaco, name + '/' + key, result.dtsFiles[key])
  })
  Object.keys(result.dependencies || {}).forEach(key => {
    dependLoader(key, result.dependencies[key], monaco)
  })
}

function inject(monaco: Monaco, key: string, lib: string) {
  const libUri = `inmemory://model/node_modules/${key}`
  monaco.languages.typescript.typescriptDefaults.addExtraLib(lib, libUri)
  // const currentModel = monaco.editor.getModel(monaco.Uri.parse(libUri))
  // if (currentModel) {
  //   currentModel.dispose()
  // }
  // monaco.editor.createModel(lib, 'typescript', monaco.Uri.parse(libUri))
}
