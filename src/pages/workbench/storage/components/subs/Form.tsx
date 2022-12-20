import { Button, Form, Input, message, Select, Switch } from 'antd'
import { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { StorageConfig, StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'
import useEnvOptions from '@/lib/hooks/useEnvOptions'

interface Props {
  content?: StorageResp
}

export default function StorageForm({ content }: Props) {
  const { handleSwitch } = useContext(StorageSwitchContext)
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)

  const config = useMemo(() => content?.config, [content])

  const [form] = Form.useForm()
  const accessKeyIDKind = Form.useWatch(['accessKeyID', 'kind'], form)
  const secretAccessKeyKind = Form.useWatch(['secretAccessKey', 'kind'], form)
  const [testing, setTesting] = useState(false)
  const envOptions = useEnvOptions()

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
    setTesting(true)
    const values = form.getFieldsValue()
    void requests
      .post('/s3Upload/checkConn', {
        config: { ...values },
        name: values.name
      })
      .then((x: any) => {
        if (x?.status) {
          message.success('连接成功')
        } else {
          message.error(x?.msg || '连接失败')
        }
      })
      .finally(() => {
        setTesting(false)
      })
  }

  return (
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
        initialValues={{ accessKeyID: { kind: '0' }, secretAccessKey: { kind: '0' }, ...config }}
      >
        <Form.Item label="名称" rules={[{ required: true, message: '请输入名称' }]} name="name">
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          label="服务地址"
          name="endpoint"
          rules={[{ required: true, message: '请输入服务地址' }]}
        >
          <Input addonBefore="http(s)://" placeholder="请输入..." />
        </Form.Item>
        <Form.Item label="App ID">
          <Input.Group compact className="!flex">
            <Form.Item name={['accessKeyID', 'kind']} noStyle>
              <Select className="w-100px flex-0">
                <Select.Option value="0">值</Select.Option>
                <Select.Option value="1">环境变量</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['accessKeyID', 'val']}
              noStyle
              rules={[{ required: true, message: 'App ID不能为空' }]}
            >
              {accessKeyIDKind === '0' ? (
                <Input className="flex-1" placeholder="请输入" />
              ) : (
                <Select className="flex-1" options={envOptions} />
              )}
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="App Secret">
          <Input.Group compact className="!flex">
            <Form.Item name={['secretAccessKey', 'kind']} noStyle>
              <Select className="w-100px flex-0">
                <Select.Option value="0">值</Select.Option>
                <Select.Option value="1">环境变量</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={['secretAccessKey', 'val']}
              noStyle
              rules={[{ required: true, message: 'App Secret不能为空' }]}
            >
              {secretAccessKeyKind === '0' ? (
                <Input className="flex-1" placeholder="请输入" />
              ) : (
                <Select className="flex-1" options={envOptions} />
              )}
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          label="区域"
          name="bucketLocation"
          rules={[{ required: true, message: '请输入区域' }]}
        >
          <Input placeholder="请输入..." />
        </Form.Item>
        <Form.Item
          label="bucketName"
          name="bucketName"
          rules={[{ required: true, message: '请输入bucketName' }]}
        >
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
          <Button
            className="btn-cancel"
            onClick={() => {
              // 无id的情况下取消，后退到前一个页面
              if (!content?.id) {
                navigate(-1)
                return
              }
              handleSwitch('detail', content?.id)
            }}
          >
            <span>取消</span>
          </Button>
          <Button className="btn-test ml-4" onClick={() => handleTest()} loading={testing}>
            测试
          </Button>
          <Button className="btn-save ml-4" onClick={() => form.submit()}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
