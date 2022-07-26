import Editor from '@monaco-editor/react'
import { Descriptions, Input, Switch } from 'antd'
import { ReactNode, useContext } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './datasource-common.module.scss'
interface Props {
  content: DatasourceResp
}
interface Config {
  [key: string]: ReactNode
}
interface PropsInfo {
  info: Config
  name: string
  editDefineSelf: (key: string, value: string) => void
}

function DatasourceDefineItem({ info, name, editDefineSelf }: PropsInfo) {
  const [isEditing, setIsEditing] = useImmer(false)

  function handleItemEdit(key: string, value: string) {
    editDefineSelf(key, value)
    setIsEditing(false)
  }

  return (
    <div>
      {isEditing ? (
        <Input
          onBlur={(e) => handleItemEdit(name, e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => handleItemEdit(e.target.value)}
          className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
          defaultValue={info.serverName as string}
          autoFocus
          placeholder="请输入外部数据源名"
        />
      ) : (
        <>
          {info[name]}
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
          dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 4) })
        })
      })
    console.log('switch change')
  }

  const editDefineSelf = (key: string, value: string) => {
    config[key] = value
    console.log(config, '123')
    void requests.put('/dataSource', { ...content, config: JSON.stringify({ ...config }) })
    void requests.get<unknown, DatasourceResp[]>('/dataSource').then((res) => {
      dispatch({ type: 'fetched', data: res.filter((item) => item.source_type == 4) })
    })
  }

  return (
    <>
      <div className="border-gray border-b pb-5">
        <span className="ml-2">{content.name}</span>
        <span className="ml-2 text-xs text-gray-500/80">main</span>
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
              info={config}
              name="connectName"
              editDefineSelf={editDefineSelf}
            />
          </Descriptions.Item>
          <Descriptions.Item label="类型">
            <DatasourceDefineItem info={config} name="type" editDefineSelf={editDefineSelf} />
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <span className="ml-2 text-xs text-gray-500/80">
          <IconFont type="icon-zhuyi" className="mr-2" />
          主要用于日志等副作用操作
        </span>
        <Switch checked={content.switch == 1 ? true : false} onChange={connectSwitchOnChange} />
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
