import { CaretRightOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions, Tabs } from 'antd'

import styles from './datasource-rest-main.module.scss'

export default function DatasourceRestMainCheck() {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }

  const menus = {
    nameScope: 'thirdapi',
    endpoint: 'https://www.qq.com/w',
    theOAS: '文件一',
  }
  const menus2 = {
    JWTget: '静态',
    secretKey: 'eps',
    signMethod: '5432',
    tokenPoint: 'root',
  }
  const menus3 = {
    isStateCombine: '是否状态联合',
  }

  const { TabPane } = Tabs

  const onChange = (key: string) => {
    console.log(key)
  }

  return (
    <>
      <div className="pb-17px flex items-center justify-between border-gray border-b mb-8">
        <div>
          <span className="ml-2">
            userinfo <span className="text-xs text-gray-500/80">GET</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-btn']}
          />
          <Button className={styles['connect-btn']}>
            <span>编辑</span>
          </Button>
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <Descriptions
          bordered
          column={1}
          size="small"
          className={styles['descriptions-box']}
          labelStyle={{
            backgroundColor: 'white',
            width: '30%',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        >
          <Descriptions.Item label="命名空间">{menus.nameScope}</Descriptions.Item>
          <Descriptions.Item label="REST端点">{menus.endpoint}</Descriptions.Item>
          <Descriptions.Item label="指定OAS">{menus.theOAS}</Descriptions.Item>
        </Descriptions>
      </div>

      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="请求头" key="1">
          <div className="flex justify-center ">
            <Descriptions
              bordered
              column={1}
              size="small"
              className={styles['descriptions-box']}
              labelStyle={{
                backgroundColor: 'white',
                width: '30%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item label="JWT获取">{menus2.JWTget}</Descriptions.Item>
              <Descriptions.Item label="密钥">{menus2.secretKey}</Descriptions.Item>
              <Descriptions.Item label="签名方法">{menus2.signMethod}</Descriptions.Item>
              <Descriptions.Item label="Token端点">{menus2.tokenPoint}</Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
        <TabPane tab="授权" key="2">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>

      <div className={styles['more-info']}>
        <CaretRightOutlined className={styles['more-icon']} />
        <span>更多</span>
      </div>
      <div className="flex justify-center">
        <Descriptions
          bordered
          column={1}
          size="small"
          className={styles['descriptions-box']}
          labelStyle={{
            backgroundColor: 'white',
            width: '30%',
            borderRight: 'none',
            borderBottom: 'none',
          }}
        >
          <Descriptions.Item label="是否状态联合">{menus3.isStateCombine}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
