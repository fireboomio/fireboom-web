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

  const handleTest = () => {
    // TODO 测试接口
  }

  return (
    <>
      <div className={`${styles['form-contain']}`}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 11 }}
          onFinish={values => void onFinish(values as StorageConfig)}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          className="ml-3"
          initialValues={{ ...config }}
        >
          <Form.Item label="名称" rules={[{ required: true, message: '请输入名称' }]} name="name">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务地址" name="endpoint">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item
            label="App ID"
            rules={[{ required: true, message: '请输入 App ID' }]}
            name="accessKeyID"
          >
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item
            label="App Secret"
            rules={[{ required: true, message: '请输入 App Secret' }]}
            name="secretAccessKey"
          >
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
          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button className="btn-cancel" onClick={() => handleSwitch('detail', content?.id)}>
              <span>取消</span>
            </Button>
            <Button className="btn-test ml-4" onClick={() => handleTest()}>
              测试
            </Button>
            <Button
              className="btn-save ml-4"
              onClick={() => {
                form.submit()
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
