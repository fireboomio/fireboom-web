import { loader } from '@monaco-editor/react'
import { Descriptions, Input, message, Switch } from 'antd'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import IdeContainer from '@/components/Ide'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

import styles from './Custom.module.less'

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

  return (
    <>
      <div className="pb-9px flex items-center justify-between border-gray border-b mb-5">
        <div>
          <span className="ml-2">{content.name}</span>
        </div>
        <div className="flex  items-center">
          <Switch
            checked={content.switch == 0 ? true : false}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-check-btn']}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Descriptions bordered column={1} size="small" className="w-full mt-4">
          <Descriptions.Item label="连接名" className="h-12">
            <>
              {isEditing ? (
                <Input
                  onBlur={e => handleEdit(e.target.value)}
                  // @ts-ignore
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  onPressEnter={e => handleEdit(e.target.value)}
                  style={{ width: '200px' }}
                  defaultValue={config.serverName}
                  autoFocus
                  placeholder="请输入外部数据源名"
                />
              ) : (
                <>
                  {config.apiNamespace}
                  <span onClick={() => setIsEditing(true)} className="ml-3 cursor-pointer">
                    <IconFont type="icon-bianji" />
                  </span>
                </>
              )}
            </>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <span className="ml-2 text-xs text-gray-500/80">
          <IconFont type="icon-zhuyi" className="mr-2" />
          主要用于日志等副作用操作
        </span>
      </div>
      {content.name ? (
        <IdeContainer hookPath={`customize/${content.name}`} defaultLanguage="typescript" />
      ) : (
        ''
      )}
    </>
  )
}
