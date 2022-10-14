import { Button, Form, message, InputNumber, Switch } from 'antd'
import { useEffect, useState } from 'react'

import requests from '@/lib/fetchers'

import styles from './index.module.scss'
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
        message.success('保存成功')
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
      <div className={styles.tip}>授权</div>
      <Form.Item label="需要授权">
        <>
          <Form.Item noStyle name="authenticationRequired" valuePropName="checked">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          <span className={styles.tip} style={{ marginLeft: 12 }}>
            开启后，登录后才能访问
          </span>
        </>
      </Form.Item>
      <div className={styles.tip}>缓存</div>
      <Form.Item label="开启缓存" name="cachingEnable" valuePropName="checked">
        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
      </Form.Item>
      <Form.Item label="最大时长" name="cachingMaxAge">
        <InputNumber addonAfter="秒" />
      </Form.Item>
      <Form.Item label="重新校验时长" name="cachingStaleWhileRevalidate">
        <InputNumber addonAfter="秒" />
      </Form.Item>
      <div className={styles.tip}>实时</div>
      <Form.Item label="开启时长" name="liveQueryEnable" valuePropName="checked">
        <Switch checkedChildren="开启" unCheckedChildren="关闭" />
      </Form.Item>

      <Form.Item label="轮询间隔" name="liveQueryPollingIntervalSeconds">
        <InputNumber addonAfter="秒" />
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
