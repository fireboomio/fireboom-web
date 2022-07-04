import {
  CaretRightOutlined,
  QuestionCircleOutlined,
  EyeFilled,
  EyeInvisibleFilled,
} from '@ant-design/icons'
import { Button, Switch, Descriptions, Tabs, Collapse } from 'antd'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces/datasource'

import styles from './datasource-common-main.module.scss'

interface Props {
  content: DatasourceItem
}

export default function DatasourceGraphalMainCheck({ content }: Props) {
  const [isEyeShow, setIsEyeShow] = useImmer(false)
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { info } = content
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
          <Button className={styles['design-btn']}>
            <span>设计</span>
          </Button>
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
            {info.nameScope}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div>
                <span className={styles['label-style']}>Graphql 端点</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            className="justify-start"
          >
            {info.endpoint}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <div>
                <span className={styles['label-style']}>指定Schema</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            className="justify-start"
          >
            {info.theOAS}
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
              <Descriptions.Item>{info.head}</Descriptions.Item>
              <Descriptions.Item>{info.way}</Descriptions.Item>
              <Descriptions.Item>{info.code}</Descriptions.Item>
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
                width: '30%',
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              <Descriptions.Item label="JWT获取">{info.JWTget}</Descriptions.Item>
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
              <Descriptions.Item label="签名方法">{info.signMethod}</Descriptions.Item>
              <Descriptions.Item label="Token端点">{info.tokenPoint}</Descriptions.Item>
            </Descriptions>
          </div>
        </TabPane>
      </Tabs>
      <Collapse
        bordered={false}
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className="site-collapse-custom-collapse bg-light-50"
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
                    <span className={styles['label-style']}>是否内部</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {info.isInside}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>自定义Float标量</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {info.isFloat}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>自定义INT标量</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {info.isInt}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <div>
                    <span className={styles['label-style']}>排除重命名根字段</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {info.isRename}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Panel>
      </Collapse>
    </>
  )
}
