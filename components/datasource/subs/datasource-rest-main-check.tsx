import {
  CaretRightOutlined,
  QuestionCircleOutlined,
  EyeFilled,
  EyeInvisibleFilled,
} from '@ant-design/icons'
import { Button, Switch, Descriptions, Tabs, Collapse } from 'antd'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'

import styles from './datasource-common-main.module.scss'

interface Props {
  content: DatasourceResp
}

export default function DatasourceRestMainCheck({ content }: Props) {
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { config } = content
  const { TabPane } = Tabs
  const { Panel } = Collapse
  const onChange = (key: string) => {
    console.log(key)
  }
  const changeEyeState = () => {
    setIsEyeShow(!isEyeShow)
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
            className={styles['switch-check-btn']}
          />
          <Button className={styles['edit-btn']}>
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
          <Descriptions.Item
            label={
              <div>
                <span className={styles['label-style']}>命名空间</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            className="justify-start"
          >
            {config.nameScope}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div>
                <span className={styles['label-style']}>Rest 端点</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            className="justify-start"
          >
            {config.endpoint}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div>
                <span className={styles['label-style']}>指定OAS</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            className="justify-start"
          >
            {config.theOAS}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <Tabs defaultActiveKey="1" onChange={onChange}>
        <TabPane tab="请求头" key="1">
          <div className="flex justify-center mb-8">
            <Descriptions
              bordered
              column={3}
              size="small"
              className={styles['descriptions-box']}
              labelStyle={{
                backgroundColor: 'white',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item>{config.head}</Descriptions.Item>
              <Descriptions.Item>{config.way}</Descriptions.Item>
              <Descriptions.Item>{config.code}</Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
        <TabPane
          tab={
            <div>
              <span className={styles['label-style']}>授权</span>
              <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
            </div>
          }
          key="2"
        >
          <div className="flex justify-center ">
            <Descriptions
              bordered
              column={1}
              size="small"
              className={styles['descriptions-box']}
              labelStyle={{
                backgroundColor: 'white',
                borderRight: 'none',
                borderBottom: 'none',
                width: '30%',
              }}
            >
              <Descriptions.Item label="JWT获取">{config.JWTget}</Descriptions.Item>
              <Descriptions.Item label="密钥">
                {isEyeShow ? (
                  <div>
                    <span className="mr-5">123456</span>
                    <EyeFilled onClick={changeEyeState} />
                  </div>
                ) : (
                  <div>
                    <span className="mr-5">********</span>
                    <EyeInvisibleFilled onClick={changeEyeState} />
                  </div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="签名方法">{config.signMethod}</Descriptions.Item>
              <Descriptions.Item label="Token端点">{config.tokenPoint}</Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
      </Tabs>
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className={`${styles['collapse-box']} site-collapse-custom-collapse bg-light-50`}
      >
        <Panel header="更多" key="1" className="site-collapse-custom-panel">
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
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>是否状态联合</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.isStateCombine}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Panel>
      </Collapse>
    </>
  )
}
