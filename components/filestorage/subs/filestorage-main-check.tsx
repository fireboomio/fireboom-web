import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions, Divider } from 'antd'
import { useImmer } from 'use-immer'

import type { FileStorageResp } from '@/interfaces/filestorage'

import styles from './filestorage-common-main.module.scss'
// import styles from './datasource-db-main.module.scss'
interface Props {
  content: FileStorageResp
}
export default function FileStorageMainCheck({ content }: Props) {
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { config } = content
  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
  }
  console.log(config)
  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-check-btn']}
          />
          <Divider type="vertical" />
          <Button className={styles['center-btn']}>
            <span>取消</span>
          </Button>
          <Button className={styles['save-btn']}>
            <span>保存</span>
          </Button>
        </div>
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
          <Descriptions.Item label="名称">{content.name}</Descriptions.Item>
          <Descriptions.Item label="服务地址">{config}</Descriptions.Item>
          <Descriptions.Item label="APP ID">{config} </Descriptions.Item>
          <Descriptions.Item label="APP Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {config}
                  <EyeOutlined className="ml-6" />
                </div>
              ) : (
                <div>
                  *****************************
                  <EyeInvisibleOutlined className="ml-6" />
                </div>
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="区域">{config}</Descriptions.Item>
          <Descriptions.Item label="bucketName">{config}</Descriptions.Item>
          <Descriptions.Item label="开启SSL">
            <div>
              <Button className={styles['SSL-open-btn']}>开启</Button>
              <Button className={styles['SSL-close-btn']}>关闭</Button>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </>
  )
}
