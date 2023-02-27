/* eslint-disable react-hooks/exhaustive-deps */

import { Button, Form, Input, message, Radio, Switch } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import UrlInput from '@/components/UrlInput'
import { useConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import styles from '@/pages/workbench/setting/components/subs/subs.module.less'
interface Runtime {
  days: number
  hours: number
  minutes: number
  seconds: number
}
export default function SettingMainVersion() {
  const intl = useIntl()
  const { config, refreshConfig } = useConfigContext()
  const [count, setCount] = useImmer(0)
  useEffect(() => {
    void requests.get<unknown, string>('/setting/getTime').then(res => {
      const count = Date.parse(res)
      setCount(count)
    })
    const timer = setInterval(() => setCount(count => count + 1), 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const [form] = Form.useForm()

  function onFinish(values: any) {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }), 0)
    Promise.all(
      Object.keys(values).map(key => {
        // @ts-ignore
        if (values[key] !== config[key]) {
          return requests.post('/setting', { key: key, val: values[key] })
        }
      })
    )
      .then(() => {
        refreshConfig()
        message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
      })
      .catch(() => {
        message.error(intl.formatMessage({ defaultMessage: '保存失败' }))
      })
      .finally(hide)
  }

  const calTime = (initTime: string) => {
    const time = dayjs.duration(dayjs().diff(dayjs(initTime), 'seconds'), 'seconds') as unknown as {
      $d: Runtime
    }
    return intl.formatMessage(
      { defaultMessage: '{days}天 {hours}时 {minutes}分 {seconds}秒' },
      {
        days: time.$d.days,
        hours: time.$d.hours,
        minutes: time.$d.minutes,
        seconds: time.$d.seconds
      }
    )
  }
  return (
    <div className="pt-6">
      <Form
        className="common-form"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        labelAlign="right"
        initialValues={config}
      >
        <Form.Item label={intl.formatMessage({ defaultMessage: '运行时长' })}>
          {calTime(dayjs(count).format('YYYY-MM-DD HH:mm:ss'))}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'API外网地址' })}
          name="apiPublicAddr"
        >
          <UrlInput />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'API内网地址' })}
          name="apiInernalAddr"
          tooltip={intl.formatMessage({ defaultMessage: '钩子服务对内地址，一般不需要修改' })}
        >
          <UrlInput />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'API服务监听Host' })}
          name="apiListenHost"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'API服务监听端口' })}
          name="apiListenPort"
        >
          <Input />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ defaultMessage: '日志水平' })} name="logLevel">
          <Radio.Group>
            <Radio value={-1}>Debug</Radio>
            <Radio value={0}>Info</Radio>
            <Radio value={1}>Warn</Radio>
            <Radio value={2}>Error</Radio>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item
          label={intl.formatMessage({ defaultMessage: '调试' })}
          name="debugEnabled"
          valuePropName="checked"
        >
          <Switch className={styles['switch-edit-btn']} size="small" />
        </Form.Item> */}
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '日志上报' })}
          name="usageReport"
          valuePropName="checked"
        >
          <Switch className={styles['switch-edit-btn']} size="small" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5, span: 12 }}>
          <Button className={'btn-cancel mr-4'} onClick={() => form.resetFields()}>
            <FormattedMessage defaultMessage="重置" />
          </Button>
          <Button className={'btn-save'} onClick={form.submit}>
            <FormattedMessage defaultMessage="保存" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
