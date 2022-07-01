import { AppleOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Descriptions, Input, Switch } from 'antd'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces/datasource'

interface Props {
  content: DatasourceItem
}

interface PropsInfo {
  info: {
    [key: string]: number | string | boolean
  }
}
function DatasourceDefineItem({ info }: PropsInfo) {
  const [isEditing, setIsEditing] = useImmer(false)

  function handleItemEdit(value: string) {
    setIsEditing(false)
    console.log(value)
  }

  return (
    <div>
      {isEditing ? (
        <Input
          onBlur={(e) => handleItemEdit(e.target.value)}
          // @ts-ignore
          onPressEnter={(e) => handleItemEdit(e.target.value as string)}
          className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
          defaultValue={info.serverName as string}
          autoFocus
          placeholder="请输入外部数据源名"
        />
      ) : (
        <>
          {info.serverName}
          <span
            onClick={() => {
              setIsEditing(true)
            }}
            className="ml-3"
          >
            <EditOutlined />
          </span>
        </>
      )}
    </div>
  )
}

export default function DatasourceEditorMainEdit({ content }: Props) {
  const { info } = content

  return (
    <>
      <div className="border-gray border-b pb-5">
        <AppleOutlined />
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
            <DatasourceDefineItem info={info} />
          </Descriptions.Item>
          <Descriptions.Item label="类型">
            <DatasourceDefineItem info={info} />
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div className="mt-10 flex items-center justify-between">
        <span className="ml-2 text-xs text-gray-500/80">
          <ExclamationCircleOutlined className="mr-2" />
          主要用于日志等副作用操作
        </span>
        <Switch />
      </div>
    </>
  )
}
