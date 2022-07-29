import Editor from '@monaco-editor/react'
import { Descriptions, Input, Switch } from 'antd'
import { ReactNode, useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceDispatchContext, DatasourceToggleContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './datasource-common.module.scss'
interface Props {
  content: DatasourceResp
}
interface Config {
  [key: string]: ReactNode
}
interface PropsInfo {
  content: DatasourceResp
  name: string
  editDefineSelf: (value: string) => void
}

function DatasourceDefineItem({ content, name, editDefineSelf }: PropsInfo) {
  const [isEditing, setIsEditing] = useImmer(content.name == '')
  useEffect(() => {
    setIsEditing(content.name == '')
  }, [content])
  const config = JSON.parse(content.config) as Config
  function handleItemEdit(value: string) {
    editDefineSelf(value)
    setIsEditing(false)
  }

  return (
    <div>
      {isEditing ? (
        <Input
          onBlur={(e) => handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => handleItemEdit(e.target.value)}
          style={{ width: '200px' }}
          className="text-sm font-normal leading-4 h-5 pl-1"
          defaultValue={config.serverName as string}
          autoFocus
          placeholder="请输入外部数据源名"
        />
      ) : (
        <>
          {config[name]}
          <span
            onClick={() => {
              setIsEditing(true)
            }}
            className="ml-3"
          >
            <IconFont type="icon-bianji" />
          </span>
        </>
      )}
    </div>
  )
}

export default function DatasourceDeselfMainEdit({ content }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const config = JSON.parse(content.config) as Config
  // const [isActive, setIsActive] = useImmer(false)
  const dispatch = useContext(DatasourceDispatchContext)

  const connectSwitchOnChange = (isChecked: boolean) => {
    void requests
      .put('/dataSource', {
        ...content,
        switch: isChecked == true ? 1 : 0,
      })
      .then(() => {
        void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
          dispatch({ type: 'fetched', data: res })
        })
      })
    console.log('switch change')
  }

  const editDefineSelf = (value: string) => {
    if (value == '') {
      return
    }
    if (content.name == '') {
      void requests
        .post<unknown, number>('/dataSource', {
          ...content,
          config: JSON.stringify({ apiNamespace: value, serverName: value, schema: '' }),
          name: value,
        })
        .then((res) => {
          content.id = res
        })
    } else
      void requests.put('/dataSource', {
        ...content,
        config: JSON.stringify({ ...config }),
        name: value,
      })
    void requests
      .get<unknown, DatasourceResp[]>('/dataSource')
      .then((res) => {
        dispatch({ type: 'fetched', data: res })
      })
      .then(() => {
        handleToggleDesigner('data', content.id)
      })
  }

  return (
    <>
      <div className="border-gray border-b pb-5 flex justify-between">
        <div>
          <span className="ml-2">{content.name}</span>
          <span className="ml-2 text-xs text-gray-500/80">main</span>
        </div>
        <div>
          <Switch
            checked={content.switch == 1 ? true : false}
            onChange={connectSwitchOnChange}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            style={{ height: '24px', width: '60px' }}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Descriptions
          bordered
          column={1}
          size="small"
          className="w-270 mt-4"
          labelStyle={{
            backgroundColor: 'white',
            width: '30%',
            borderBottom: 'none',
          }}
        >
          <Descriptions.Item label="连接名">
            <DatasourceDefineItem
              content={content}
              name="apiNamespace"
              editDefineSelf={editDefineSelf}
            />
          </Descriptions.Item>
          <Descriptions.Item label="类型">
            {/* <DatasourceDefineItem
              content={content}
              name="serverName"
              editDefineSelf={editDefineSelf}
        />*/}
            {config.serverName}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <span className="ml-2 text-xs text-gray-500/80">
          <IconFont type="icon-zhuyi" className="mr-2" />
          主要用于日志等副作用操作
        </span>
      </div>
      <Editor
        height="90vh"
        defaultLanguage="typescript"
        defaultValue="// some comment"
        className={`mt-4 ${styles.monaco}`}
      />
      <div />
    </>
  )
}
