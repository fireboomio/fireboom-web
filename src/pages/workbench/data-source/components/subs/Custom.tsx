import { loader } from '@monaco-editor/react'

import type { ApiDocuments } from '@/services/a2s.namespace'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export interface Config {
  apiNamespace: string
  schema: string
  serverName: string
}

interface Props {
  content: ApiDocuments.Datasource
}

export default function Custom({ content }: Props) {
  return <></>
}
