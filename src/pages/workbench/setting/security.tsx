/* eslint-disable react-hooks/exhaustive-deps */

import { MinusCircleOutlined } from '@ant-design/icons'
import { Button, Form, message, Switch } from 'antd'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import UrlInput from '@/components/UrlInput'
import { useConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import tipGraphql from '@/pages/workbench/setting/components/subs/assets/tip-graphql.png'

interface SecurityConfig {
  allowedHostsEnable: boolean
  enableGraphQLEndpoint: boolean
  allowedHosts: Array<string>
}

export default function SettingMainVersion() {
  const intl = useIntl()
  const { config, refreshConfig } = useConfigContext()
  const [form] = Form.useForm()
  const allowedHostsEnable = Form.useWatch('allowedHostsEnable', form)
  const { data: securityConfig, mutate: mutateSecurityConfig } = useSWRImmutable<SecurityConfig>(
    '/setting/securityConfig',
    requests.get
  )
  const { data: redirectUrl, mutate: mutateRedirectUrl } = useSWRImmutable(
    '/auth/redirectUrl',
    requests.get
  )
  useEffect(() => {
    form.resetFields()
  }, [securityConfig, redirectUrl])

  function onFinish(values: any) {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }), 0)
    Promise.all(
      Object.keys(values).map(key => {
        // @ts-ignore
        if (key === 'redirectUrl') {
          if (JSON.stringify(values[key]) !== JSON.stringify(redirectUrl)) {
            return requests.post('/auth/redirectUrl', {
              redirectURLs: values.redirectUrl
            })
          }
        } else {
          // @ts-ignore
          if (JSON.stringify(values[key]) !== JSON.stringify(securityConfig?.[key])) {
            return requests.post('/global', { key: key, val: values[key] })
          }
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

  return (
    <div className="pt-6">
      <Form
        className="common-form"
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        labelAlign="right"
        initialValues={securityConfig && redirectUrl && ({ ...securityConfig, redirectUrl } as any)}
      >
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'GraphQL端点' })}
          name="enableGraphQLEndpoint"
          valuePropName="checked"
        >
          <div className="flex items-center">
            <Switch />
            <img
              alt="zhuyi"
              src="assets/iconfont/zhuyi.svg"
              className="mr-1 ml-2 h-3 text-[14px]"
            />
            <span className="text-[#ff4d4f] text-[12px]">
              https://localhost:9991/api/main/graphql
            </span>
          </div>
        </Form.Item>
        <Form.Item
          tooltip={{
            title: <img src={tipGraphql} className="max-w-60vw max-h-60vh" alt="" />,
            rootClassName: 'max-w-80vw max-h-80vh'
          }}
          label={intl.formatMessage({ defaultMessage: '允许主机' })}
          name="allowedHostsEnable"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.List name="allowedHosts">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  hidden={allowedHostsEnable}
                  label={intl.formatMessage({ defaultMessage: '允许HOST' }) + (index + 1)}
                  key={field.key}
                >
                  <Form.Item {...field} noStyle>
                    <UrlInput />
                  </Form.Item>
                  <MinusCircleOutlined
                    className="absolute right-0 top-0 mt-2 -mr-6"
                    onClick={() => remove(field.name)}
                  />
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ offset: 5, span: 12 }} hidden={allowedHostsEnable}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  {intl.formatMessage({ defaultMessage: '增加允许HOST' })}
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name="redirectUrl">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={intl.formatMessage({ defaultMessage: '重定向URL' }) + (index + 1)}
                  key={field.key}
                >
                  <Form.Item {...field} noStyle>
                    <UrlInput />
                  </Form.Item>
                  <MinusCircleOutlined
                    className="absolute right-0 top-0 mt-2 -mr-6"
                    onClick={() => remove(field.name)}
                  />
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ offset: 5, span: 12 }}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  {intl.formatMessage({ defaultMessage: '增加重定向URL' })}
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
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
