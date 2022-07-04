import { AppleOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions } from 'antd'
import { useContext } from 'react'

import type { DatasourceItem } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context'

import styles from './datasource-db-main.module.scss'
interface Props {
  content: DatasourceItem
}
export default function DatasourceDBMainCheck({ content }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { info } = content

  return (
    <>
      <div className="pb-17px flex items-center justify-between border-gray border-b ">
        <div>
          <AppleOutlined />
          <span className="ml-2">
            {content.name} <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className="ml-6 w-15 bg-green-500"
          />
          <Button className={`${styles['connect-check-btn-common']} w-20 ml-12`}>
            <span>测试链接</span>
          </Button>
          <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
            <span>设计</span>
          </Button>
          <Button className={`${styles['connect-check-btn']}  ml-4`}>
            <span>编辑</span>
          </Button>
        </div>
      </div>
      <div
        className={`${styles['db-check-setting']} float-right mt-2 cursor-pointer`}
        onClick={() => {
          handleToggleDesigner('Setting', content.id)
        }}
      >
        <span className="mr-2 w-14 h-5">更多设置</span> <RightOutlined />
      </div>

      <div className="mt-8">
        <Descriptions
          bordered
          column={1}
          size="small"
          labelStyle={{
            color: '#5F6269',
            backgroundColor: 'white',
            width: '30%',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        >
          <Descriptions.Item label="连接名">{info.connectName}</Descriptions.Item>
          <Descriptions.Item label="类型">{info.SQlType}</Descriptions.Item>
          <Descriptions.Item label="类型">{info.typeName}</Descriptions.Item>
          <Descriptions.Item label="环境变量">{info.environmentVar}</Descriptions.Item>
          <Descriptions.Item label="连接URL">{info.connectURL}</Descriptions.Item>
          <Descriptions.Item label="主机">{info.host}</Descriptions.Item>
          <Descriptions.Item label="数据库名">{info.DBName}</Descriptions.Item>
          <Descriptions.Item label="端口">{info.port}</Descriptions.Item>
          <Descriptions.Item label="用户">{info.userName}</Descriptions.Item>
          <Descriptions.Item label="密码">{info.password}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
