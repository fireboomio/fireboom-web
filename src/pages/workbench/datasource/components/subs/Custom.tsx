import { loader } from '@monaco-editor/react'
import { message } from 'antd'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IdeContainer from '@/components/Ide'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export interface Config {
  apiNamespace: string
  schema: string
  serverName: string
}

interface Props {
  content: DatasourceResp
}

export default function Custom({ content }: Props) {
  const { handleSave } = useContext(DatasourceToggleContext)
  const dispatch = useContext(DatasourceDispatchContext)
  const [isEditing, setIsEditing] = useImmer(content.name == '')
  const [code, setCode] = useImmer('')

  const config = content.config as unknown as Config

  useEffect(() => {
    setIsEditing(content.name == '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  useEffect(() => {
    setCode(config.schema)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.config.schema])

  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 0 : 1
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then(res => {
          dispatch({ type: 'fetched', data: res })
        })
      })
  }

  const handleEdit = (value: string) => {
    if (value == '') {
      return
    }

    if (content.name == '' || content.name.startsWith('example_')) {
      const req = {
        ...content,
        config: { apiNamespace: value, serverName: value, schema: '' },
        name: value
      }
      Reflect.deleteProperty(req, 'id')
      void requests.post<unknown, number>('/dataSource', req).then(res => {
        content.id = res
        handleSave(content)
      })
    } else {
      const newContent = {
        ...content,
        config: { ...config, apiNamespace: value, serverName: value },
        name: value
      }
      void requests.put(`/dataSource/${content.id}`, newContent).then(() => {
        handleSave(newContent)
      })
    }

    setIsEditing(false)
  }

  const save = () => {
    void requests
      .put(`/dataSource/content/${content.id}`, { content: code })
      .then(() => void message.success('保存成功!'))
  }

  return <IdeContainer hookPath={`customize/${content.name}`} defaultLanguage="typescript" />
}
