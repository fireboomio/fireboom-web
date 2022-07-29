import { Button, Form, Input, Switch, Divider } from 'antd'
import { useContext } from 'react'

import type { StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext, StorageDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './storage-main.module.scss'

interface Props {
  content: StorageResp
}

export default function StorageForm({ content }: Props) {
  const { handleSwitch } = useContext(StorageSwitchContext)
  const dispatch = useContext(StorageDispatchContext)

  const [form] = Form.useForm()

  const onFinish = async (values: object) => {
    console.log('Success:', values)
    console.log(JSON.stringify(values))
    await requests.put('/storageBucket ', values)
    const storageBucket = await requests.get<unknown, Array<StorageResp>>('/storageBucket ')
    console.log(storageBucket)
    dispatch({
      type: 'fetched',
      data: storageBucket,
    })
    handleSwitch(content.id, 'detail')
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            className={styles['switch-check-btn']}
          />
          <Divider type="vertical" />
          <Button className={styles['center-btn']}>
            <span>取消</span>
          </Button>
          <Button
            className={styles['save-btn']}
            onClick={() => {
              form.submit()
              handleSwitch(content.id, 'detail')
            }}
          >
            <span>保存</span>
          </Button>
        </div>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 11 }}
          onFinish={(values) => void onFinish(values as object)}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          labelAlign="left"
          className="ml-3"
        >
          <Form.Item label="名称" name="name">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务地址" name="service_address">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" required name="accessKeyID">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" required name="secretAccessKey">
            <Input.Password placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="区域" name="bucketLocation">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="bucketName" name="bucketName">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item
            label="开启SSL"
            style={{ marginTop: '29px' }}
            rules={[{ required: true }]}
            name="useSSL"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch className={styles['switch-set-btn']} size="small" />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
