import { loader } from '@monaco-editor/react'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
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
