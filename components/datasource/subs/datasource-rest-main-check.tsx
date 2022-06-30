import { CaretRightOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions, Tabs } from 'antd'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './datasource-rest-main.module.scss'

interface Props {
  content: DatasourceItem
}

export default function DatasourceRestMainCheck({ content }: Props) {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { info } = content
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
          <Descriptions.Item label="命名空间">{info.nameScope}</Descriptions.Item>
          <Descriptions.Item label="REST端点">{info.endpoint}</Descriptions.Item>
          <Descriptions.Item label="指定OAS">{info.theOAS}</Descriptions.Item>
        </Descriptions>
      </div>

      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="请求头" key="1">
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
              <Descriptions.Item label="autheration">{info.autheration}</Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
        <TabPane tab="授权" key="2">
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
              <Descriptions.Item label="JWT获取">{info.JWTget}</Descriptions.Item>
              <Descriptions.Item label="密钥">{info.secretKey}</Descriptions.Item>
              <Descriptions.Item label="签名方法">{info.signMethod}</Descriptions.Item>
              <Descriptions.Item label="Token端点">{info.tokenPoint}</Descriptions.Item>
            </Descriptions>
          </div>
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
          <Descriptions.Item label="是否状态联合">{info.isStateCombine}</Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
