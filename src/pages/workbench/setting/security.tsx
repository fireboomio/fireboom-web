/* eslint-disable react-hooks/exhaustive-deps */

import { MinusCircleOutlined, PaperClipOutlined } from '@ant-design/icons'
import { Button, Form, message, Switch } from 'antd'
import { useContext, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import UrlInput from '@/components/UrlInput'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import tipGraphql from '@/pages/workbench/setting/components/subs/assets/tip-graphql.png'

interface security {
  allowedHostsEnabled: boolean
  enableGraphQLEndpoint: boolean
  enableCSRF: boolean
  allowedHosts: Array<string>
}

export default function SettingMainVersion() {
  const intl = useIntl()
  const { system: globalConfig } = useContext(ConfigContext)
  const [form] = Form.useForm()
  const allowedHostsEnabled = Form.useWatch('allowedHostsEnabled', form)

  const { data: global, mutate: mutate } = useSWRImmutable<any>('/setting/global', requests.get)

  useEffect(() => {
    form.resetFields()
  }, [global])
  if (!global) {
    return null
  }
  const { authorizedRedirectUris, configureWunderGraphApplication } = global
  const { security } = configureWunderGraphApplication

  async function onFinish(values: any) {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }), 0)
    const saveValues = Object.keys(values)
      .map(key => {
        if (key === 'authorizedRedirectUris') {
          if (JSON.stringify(values[key]) !== JSON.stringify(authorizedRedirectUris)) {
            return { key: `authorizedRedirectUris`, val: values[key] }
          }
        } else {
          // @ts-ignore
          if (JSON.stringify(values[key]) !== JSON.stringify(security?.[key])) {
            return { key: `configureWunderGraphApplication.security.${key}`, val: values[key] }
          }
        }
      })
      .filter(x => x)
    try {
      await requests.put('/setting/global', { values: saveValues })
      message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
    } catch (e) {
      console.error(e)

      message.error(intl.formatMessage({ defaultMessage: '保存失败' }))
    }
    hide()
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
        initialValues={
          security && authorizedRedirectUris && ({ ...security, authorizedRedirectUris } as any)
        }
      >
        <Form.Item label={intl.formatMessage({ defaultMessage: 'GraphQL端点' })}>
          <div className="flex items-center">
            <Form.Item name="enableGraphQLEndpoint" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
            <img
              alt="zhuyi"
              src="assets/iconfont/zhuyi.svg"
              className="h-3 mr-1 ml-2 text-[14px]"
            />
            <span className="text-[#ff4d4f] text-[12px]">
              {globalConfig.apiPublicAddr}/app/main/graphql
            </span>
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'CSRF 保护' })}
          tooltip={intl.formatMessage({
            defaultMessage: '为POST请求添加 CSRF token 保护'
          })}
        >
          <Form.Item name="enableCSRF" valuePropName="checked" noStyle>
            <Switch />
          </Form.Item>
          <Button
            type="link"
            icon={<PaperClipOutlined />}
            href="https://ansons-organization.gitbook.io/product-manual/kai-fa-wen-dang/security/csrf-token-protection"
            target="csrf"
          >
            <FormattedMessage defaultMessage="查看文档" />
          </Button>
        </Form.Item>
        <Form.Item
          tooltip={{
            title: <img src={tipGraphql} className="max-w-60vw max-h-60vh" alt="" />,
            rootClassName: 'max-w-80vw max-h-80vh'
          }}
          label={intl.formatMessage({ defaultMessage: '允许主机' })}
        >
          <div className="flex items-center">
            <Form.Item noStyle name="allowedHostsEnabled" valuePropName="checked">
              <Switch />
            </Form.Item>
            <span className="ml-2 align-middle">允许全部</span>
          </div>
        </Form.Item>
        <Form.List name="allowedHosts">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  hidden={allowedHostsEnabled}
                  label={intl.formatMessage({ defaultMessage: '允许HOST' }) + (index + 1)}
                  key={field.key}
                >
                  <Form.Item {...field} noStyle>
                    <UrlInput />
                  </Form.Item>
                  <MinusCircleOutlined
                    className="mt-2 -mr-6 top-0 right-0 absolute"
                    onClick={() => remove(field.name)}
                  />
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ offset: 5, span: 12 }} hidden={allowedHostsEnabled}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  {intl.formatMessage({ defaultMessage: '增加允许HOST' })}
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name="authorizedRedirectUris">
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
                    className="mt-2 -mr-6 top-0 right-0 absolute"
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
