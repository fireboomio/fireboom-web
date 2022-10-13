import { Button, Form, Input, InputNumber, Switch } from 'antd'
import { useEffect, useState } from 'react'

import requests from '@/lib/fetchers'

interface Props {
  id?: number
  onClose: () => void
}

interface Setting {
  authenticationRequired: boolean
  cachingEnable: boolean
  cachingMaxAge: number
  cachingStaleWhileRevalidate: number
  liveQueryEnable: boolean
  liveQueryPollingIntervalSeconds: number
}

export default function Index(props: Props) {
  const [setting, setSetting] = useState<Setting>()

  const [form] = Form.useForm()
  useEffect(() => {
    if (!props.id) {
      void requests.get<unknown, Setting>('/operateApi/setting').then(result => {
        setSetting(result)
      })
    } else {
      void requests.get<unknown, Setting>(`/operateApi/setting/${props.id}`).then(result => {
        setSetting(result)
      })
    }
  }, [])
  if (!setting) {
    return null
  }

  const onFinish = (values: Setting) => {
    void requests
      .put<unknown, any>('/operateApi/setting', {
        ...values,
        settingType: props.id ? 1 : 2,
        id: props.id || 0,
      })
      .then(() => {
        props.onClose()
      })
  }

  return (
    <Form
      form={form}
      initialValues={setting}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
      labelAlign="left"
    >
      授权
      <Form.Item label="需要授权" name="authenticationRequired" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>
      缓存
      <Form.Item label="开启缓存" name="cachingEnable" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>
      <Form.Item label="最大时长">
        <>
          <Form.Item noStyle name="cachingMaxAge">
            <InputNumber style={{ width: '80%' }} />
          </Form.Item>
          <span className="ml-1.5 text-12px">秒</span>
        </>
      </Form.Item>
      <Form.Item label="重新校验时长">
        <>
          <Form.Item noStyle name="cachingStaleWhileRevalidate">
            <InputNumber style={{ width: '80%' }} addonAfter="秒" />
          </Form.Item>
          <span className="ml-1.5 text-12px">秒</span>
        </>
      </Form.Item>
      实时
      <Form.Item label="开启时长" name="liveQueryEnable" valuePropName="checked">
        <Switch size="small" />
      </Form.Item>
      <Form.Item label="轮询间隔">
        <>
          <Form.Item noStyle name="liveQueryPollingIntervalSeconds">
            <InputNumber style={{ width: '80%' }} />
          </Form.Item>
          <span className="ml-1.5 text-12px">秒</span>
        </>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          className={'btn-save'}
          onClick={() => {
            form.submit()
          }}
        >
          保存
        </Button>
        <Button className={'btn-cancel ml-4'} onClick={props.onClose}>
          <span>取消</span>
        </Button>
      </Form.Item>
    </Form>
  )
}
