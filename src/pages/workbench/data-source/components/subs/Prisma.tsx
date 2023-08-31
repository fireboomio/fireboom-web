import { message } from 'antd'
import type * as monaco from 'monaco-editor'
import type { MutableRefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

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
  const intl = useIntl()
  const ready = useRef(false)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)
  const editorContent = useRef('')
  const [isValid, setIsValid] = useState(true)

  const readPrismaContent = () => {
    ready.current = false
    requests
      .get<any, string>(
        `/vscode/readFile?uri=${dict.prisma}/${content.customDatabase.databaseUrl.staticVariableContent}`,
        {
          // @ts-ignore
          ignoreError: true
        }
      )
      .then(res => {
        editorContent.current = res
        editorRef.current?.setValue(res)
      })
      .catch(() => {
        editorContent.current = ''
        editorRef.current?.setValue('')
      })
      .then(() => {
        ready.current = true
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
    if (!editorContent.current) {
      return message.error(intl.formatMessage({ defaultMessage: 'Prisma 数据源文件不能为空' }))
    }
    try {
      await requests.post(`/datasource/prisma/${content.name}`, editorContent.current)
      message.success(intl.formatMessage({ defaultMessage: '已保存' }))
      return true
    } catch (error) {
      return false
    }
  }

  const introspection = async () => {
    const resp = await requests.get<any, string>(`/datasource/prisma/${content.name}`)
    editorContent.current = resp
    editorRef.current?.setValue(resp)
  }

  if (actionRef) {
    actionRef.current = {
      save,
      introspection
    }
  }

  const editor = useMemo(() => {
    return (
      <ModelEditor
        actionRef={editorRef}
        onUpdateValidate={setIsValid}
        onChange={value => {
          if (ready.current) {
            editorContent.current = value
          }
        }}
        defaultContent=""
        onReady={() => {
          if (editorContent.current) {
            editorRef.current?.setValue(editorContent.current)
          }
        }}
      />
    )
  }, [])

  return editor
}

export default PrismaDS
