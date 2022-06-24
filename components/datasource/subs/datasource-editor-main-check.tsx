import { RightSquareOutlined, AppleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions } from 'antd'

import styles from './datasource-editor-main.module.scss'

export default function DatasourceEditorMainCheck() {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  const menus = {
    connectName: 'default_db',
    SQlType: 'MySQL',
    typeName: '环境变量',
    environmentVar: 'HASURA_GRAPHQL_DB_UR',
    connectURL: 'postgresql://username:password@hostname:5432/database',
    host: 'localhost',
    DBName: 'eps',
    port: 5432,
    userName: 'user',
    password: '*******',
  }

  return (
    <>
      <div className="pb-17px flex items-center justify-between border-gray border-b mb-8">
        <div>
          <AppleOutlined />
          <span className="ml-2">
            default_db <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Button className={styles['connect-btn']}>
            <span>去环境建模</span>
          </Button>
          <Button className={styles['connect-btn']}>
            <span>
              <RightSquareOutlined className="mr-1" />
              测试链接
            </span>
          </Button>
          <Button className={styles['connect-btn']}>
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
          labelStyle={{ backgroundColor: 'white', width: '30%', borderRight:'none',borderBottom:'none' }}
        >
          <Descriptions.Item label="连接名">{menus.connectName}</Descriptions.Item>
          <Descriptions.Item label="类型">{menus.SQlType}</Descriptions.Item>
          <Descriptions.Item label="类型">{menus.typeName}</Descriptions.Item>
          <Descriptions.Item label="环境变量">{menus.environmentVar}</Descriptions.Item>
          <Descriptions.Item label="连接URL">{menus.connectURL}</Descriptions.Item>
          <Descriptions.Item label="主机">{menus.host}</Descriptions.Item>
          <Descriptions.Item label="数据库名">{menus.DBName}</Descriptions.Item>
          <Descriptions.Item label="端口">{menus.port}</Descriptions.Item>
          <Descriptions.Item label="用户">{menus.userName}</Descriptions.Item>
          <Descriptions.Item label="密码">{menus.password}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
