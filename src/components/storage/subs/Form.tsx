import { Button, Form, Input, message, Switch } from 'antd'
import { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import type { StorageConfig, StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'


interface Props {
  content?: StorageResp
}

export default function StorageForm({ content }: Props) {
  const { handleSwitch } = useContext(StorageSwitchContext)
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)

  const config = useMemo(() => content?.config, [content])

  const [form] = Form.useForm()

  const onFinish = async (values: StorageConfig) => {
    const payload = { name: values.name, config: values, useSSL: true }

    let resp: StorageResp
    if (content) {
      resp = await requests.put('/storageBucket ', { ...payload, id: content.id })
    } else {
      resp = await requests.post<unknown, StorageResp>('/storageBucket ', payload)
    }
    navigate(`/workbench/storage/${resp.id}`, { replace: true })
    onRefreshMenu('storage')
    handleSwitch('detail', resp.id)
  }

  const onFinishFailed = (_errorInfo: object) => {
    void message.error('保存失败！')
  }

  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Button
            className={styles['center-btn']}
            onClick={() => handleSwitch('detail', content?.id)}
          >
            <span>取消</span>
          </Button>
          <Button className={styles['save-btn']} onClick={() => form.submit()}>
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
          onFinish={values => void onFinish(values as StorageConfig)}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          labelAlign="left"
          className="ml-3"
          initialValues={{ ...config }}
        >
          <Form.Item label="名称" rules={[{ required: true }]} name="name">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务地址" name="endpoint">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" rules={[{ required: true }]} name="accessKeyID">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" rules={[{ required: true }]} name="secretAccessKey">
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
            name="useSSL"
            valuePropName="checked"
          >
            <Switch className={styles['switch-set-btn']} size="small" />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
