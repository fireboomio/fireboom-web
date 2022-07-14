import { AppleOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions } from 'antd'
import { ReactNode, useContext } from 'react'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context'

import styles from './datasource-db-main.module.scss'
interface Props {
  content: DatasourceResp
}
interface Config {
  [key: string]: ReactNode
}

export default function DatasourceDBMainCheck({ content }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }

  const config = JSON.parse(content.config) as Config

  return (
    <>
      <div className="pb-9px flex items-center justify-between border-gray border-b ">
        <div>
          <AppleOutlined />
          <span className="ml-2 text-[14px]">
            {content.name} <span className="text-[#AFB0B4] text-[12px]">main</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked={content.switch == 0 ? false : true}
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className="ml-6 w-15 bg-[#8ABE2A]"
          />
          <Button className={`${styles['connect-check-btn-common']} w-20 ml-12`}>
            <span>测试链接</span>
          </Button>
          <Button className={`${styles['connect-check-btn-common']} w-16 ml-4`}>
            <span>设计</span>
          </Button>
          <Button
            className={`${styles['connect-check-btn']}  ml-4`}
            onClick={() => {
              handleToggleDesigner('DB', content.id)
            }}
          >
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
        <span className="w-14 h-5">更多设置</span> <RightOutlined />
      </div>

      <div className={`mt-8 ${styles['des-contain']}`}>
        <Descriptions
          bordered
          column={1}
          size="small"
          labelStyle={{
            paddingLeft: '24px',
            color: '#5F6269',
            backgroundColor: 'white',
            width: '30%',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        >
          <Descriptions.Item label="连接名">{config.connectName}</Descriptions.Item>
          <Descriptions.Item label="类型">{config.SQlType}</Descriptions.Item>
          <Descriptions.Item label="类型">{config.typeName}</Descriptions.Item>
          <Descriptions.Item label="环境变量">{config.environmentVar}</Descriptions.Item>
          <Descriptions.Item label="连接URL">{config.connectURL}</Descriptions.Item>
          <Descriptions.Item label="主机">{config.host}</Descriptions.Item>
          <Descriptions.Item label="数据库名">{config.DBName}</Descriptions.Item>
          <Descriptions.Item label="端口">{config.port}</Descriptions.Item>
          <Descriptions.Item label="用户">{config.userName}</Descriptions.Item>
          <Descriptions.Item label="密码">{config.password}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
