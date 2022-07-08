import {
  InfoCircleOutlined,
  PauseCircleOutlined,
  PoweroffOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Descriptions, Divider, Radio, Switch, Button } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { useImmer } from 'use-immer'

import styles from './setting-main.module.scss'

export default function SettingMainVersion() {
  const [value, setValue] = useImmer(1)

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
  }

  return (
    <>
      <div>
        <div className="ml-65 -mt-6">
          <Button type="text">
            <PoweroffOutlined />
            <span>开启</span>
          </Button>
          <Button type="text">
            <PauseCircleOutlined />
            <span>暂停</span>
          </Button>
        </div>
        <Divider type="horizontal" className="mt-1" />

        <div className="flex justify-center ml-5 ">
          <Descriptions
            column={1}
            className={styles['descriptions-box']}
            labelStyle={{
              backgroundColor: 'white',
              width: '15%',
              borderRight: 'none',
              borderBottom: 'none',
              color: 'gray',
            }}
          >
            <Descriptions.Item label="运行时长">23h34m</Descriptions.Item>
            <Descriptions.Item label="API端口">
              9921 <EditOutlined className="ml-2" />
            </Descriptions.Item>
            <Descriptions.Item label="中间件端口">
              9921 <EditOutlined className="ml-2" />
            </Descriptions.Item>
            <Descriptions.Item label="类型">
              {' '}
              <Radio.Group defaultValue="env" onChange={onChange} value={value}>
                <Radio value={1} className="mr-15 ">
                  info
                </Radio>
                <Radio value={2} className="mr-15">
                  debug
                </Radio>
                <Radio value={3}> error </Radio>
              </Radio.Group>
            </Descriptions.Item>
            <Descriptions.Item label="开发者模式">
              <Switch defaultChecked className={styles['switch-edit-btn']} size="small" />
            </Descriptions.Item>
            <Descriptions.Item label="强制跳转">
              <Switch defaultChecked className={styles['switch-edit-btn']} size="small" />
            </Descriptions.Item>
          </Descriptions>
        </div>

        <div>
          <Button className={styles['edit-btn']}>
            <span>重启</span>
          </Button>
          <span className={styles.setTitle}>
            <InfoCircleOutlined />
            XXX已修改，请点击重启
          </span>
        </div>
      </div>
    </>
  )
}
