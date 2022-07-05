import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Switch, Descriptions } from 'antd'
import { useImmer } from 'use-immer'

import type { FileStorageItem } from '@/interfaces/filestorage'

import styles from './filestorage-common-main.module.scss'
// import styles from './datasource-db-main.module.scss'
interface Props {
  content: FileStorageItem
}
export default function FileStorageMainCheck({ content }: Props) {
  const [isShowSecret, setIsShowSecret] = useImmer(false)
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  if (!content) {
    return <></>
  }
  const { info } = content
  const handleToggleSecret = () => {
    setIsShowSecret(!isShowSecret)
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
          <Descriptions.Item label="名称">{info.connectName}</Descriptions.Item>
          <Descriptions.Item label="服务地址">{info.SQlType}</Descriptions.Item>
          <Descriptions.Item label="APP ID">{info.typeName} </Descriptions.Item>
          <Descriptions.Item label="APP Secret">
            <span onClick={handleToggleSecret}>
              {isShowSecret ? (
                <div>
                  {info.environmentVar}
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
          <Descriptions.Item label="区域">{info.connectURL}</Descriptions.Item>
          <Descriptions.Item label="bucketName">{info.host}</Descriptions.Item>
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
