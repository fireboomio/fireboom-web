import { RightSquareOutlined, AppleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions } from 'antd'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './datasource-db-main.module.scss'
interface Props {
  content: DatasourceItem
}
export default function DatasourceEditorMainCheck({ content }: Props) {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { info } = content

  return (
    <>
      <div className="pb-17px flex items-center justify-between border-gray border-b mb-8">
        <div>
          <AppleOutlined />
          <span className="ml-2">
            {content.name} <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Button className={styles['connect-check-btn']}>
            <span>去环境建模</span>
          </Button>
          <Button className={styles['connect-check-btn']}>
            <span>
              <RightSquareOutlined className="mr-1" />
              测试链接
            </span>
          </Button>
          <Button className={styles['connect-check-btn']}>
            <span>
              <RightSquareOutlined className="mr-2" />
              编辑
            </span>
          </Button>
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className="ml-6 w-15 bg-green-500"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Descriptions
          bordered
          column={1}
          size="small"
          className="w-270"
          labelStyle={{
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
