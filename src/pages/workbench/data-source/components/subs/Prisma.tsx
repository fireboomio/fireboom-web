import type * as monaco from 'monaco-editor'
import type { MutableRefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

import type { ShowType } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'
import ModelEditor from '@/pages/workbench/modeling/components/designer/editor'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'

export type PrismaDSAction = {
  save: () => Promise<boolean>
  introspection: () => Promise<void>
}

interface PrismaDSProps {
  content: ApiDocuments.Datasource
  type: ShowType
  actionRef?: MutableRefObject<PrismaDSAction | null>
}

const PrismaDS = ({ content, type, actionRef }: PrismaDSProps) => {
  const dict = useDict()
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
  const [editorContent, setEditorContent] = useState<string>('')
  const [isValid, setIsValid] = useState(true)

  const readPrismaContent = () => {
    requests
      .get<any, string>(
        `/vscode/readFile?uri=${dict.prisma}/${content.customDatabase.databaseUrl.staticVariableContent}`,
        {
          // @ts-ignore
          ignoreError: true
        }
      )
      .then(res => {
        setEditorContent(res)
        editorRef.current?.setValue(res)
      })
      .catch(() => {
        setEditorContent('')
        editorRef.current?.setValue('')
      })
  }

  // 读取文件内容
  useEffect(() => {
    if (content.customDatabase?.databaseUrl?.staticVariableContent) {
      readPrismaContent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.customDatabase.databaseUrl.staticVariableContent, dict.prisma])

  const save = async () => {
    return true
  }

  const introspection = async () => {
    const resp = await requests.get<any, string>(`/datasource/prisma/${content.name}`)
    setEditorContent(resp)
    editorRef.current?.setValue(resp)
  }

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        save,
        introspection
      }
    }
  }, [actionRef])

  return (
    <ModelEditor
      actionRef={editorRef}
      onUpdateValidate={setIsValid}
      onChange={value => {
        setEditorContent(value)
      }}
      defaultContent={editorContent ?? ''}
    />
  )
}

export default PrismaDS
