import { CaretRightOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions, Collapse } from 'antd'
import { ReactNode, useContext } from 'react'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context'

import styles from './datasource-common-main.module.scss'

interface Props {
  content: DatasourceResp
}
interface Config {
  [key: string]: ReactNode
}

export default function DatasourceGraphalMainCheck({ content }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const config = JSON.parse(content.config) as Config

  const { Panel } = Collapse
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
          <Button
            className={styles['edit-btn']}
            onClick={() => {
              handleToggleDesigner('Graphal', content.id)
            }}
          >
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
                <span className={styles['label-style']}>Graphql 端点</span>
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
                <span className={styles['label-style']}>指定Schema</span>
                <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
              </div>
            }
            className="justify-start"
          >
            {config.theOAS}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <h2 className="ml-3 mb-3">请求头</h2>
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
                    <span className={styles['label-style']}>是否内部</span>
                    <QuestionCircleOutlined className={`${styles['form-icon']} ml-1`} />
                  </div>
                }
                className="justify-start"
              >
                {config.isInside}
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
                {config.isFloat}
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
                {config.isInt}
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
                {config.isRename}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Panel>
      </Collapse>
    </>
  )
}
