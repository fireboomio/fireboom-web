import { MinusCircleOutlined, PaperClipOutlined } from '@ant-design/icons'
import { Button, Form, message, Switch } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import InputOrFromEnvWithItem from '@/components/InputOrFromEnv'
import UrlInput from '@/components/UrlInput'
import { useConfigContext } from '@/lib/context/ConfigContext'
// import { useConfigurationVariable } from '@/providers/variable'

interface Security {
  allowedHostsEnabled: boolean
  enableGraphQLEndpoint: boolean
  enableCSRF: boolean
  allowedHosts: Array<string>
  // forceHttpsRedirects: boolean
}

export default function SettingMainVersion() {
  const intl = useIntl()
  // const { getConfigurationValue } = useConfigurationVariable()
  const { globalSetting, updateGlobalSetting } = useConfigContext()
  const [form] = Form.useForm<Security>()

  if (!globalSetting) {
    return null
  }

  async function onFinish(values: any) {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }), 0)
    try {
      if (await updateGlobalSetting(values)) {
        message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
      }
    } catch (e) {
      //
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
        initialValues={globalSetting}
      >
        {/* <Form.Item label={intl.formatMessage({ defaultMessage: 'GraphQL端点' })}>
          <div className="flex items-center">
            <Form.Item name="enableGraphqlEndpoint" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
            <img
              alt="zhuyi"
              src="assets/iconfont/zhuyi.svg"
              className="h-3 mr-1 ml-2 text-[14px]"
            />
            <span className="text-[#ff4d4f] text-[12px]">
              {getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)}/app/main/graphql
            </span>
          </div>
        </Form.Item> */}
        <Form.Item
          label={intl.formatMessage({ defaultMessage: 'CSRF 保护' })}
          tooltip={intl.formatMessage({
            defaultMessage: '为POST请求添加 CSRF token 保护'
          })}
        >
          <Form.Item name="enableCSRFProtect" valuePropName="checked" noStyle>
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
          label={intl.formatMessage({ defaultMessage: '允许HOST' })}
          tooltip={intl.formatMessage({
            defaultMessage:
              '指定允许访问的源（域名、协议、端口），使用通配符 * 表示允许所有源进行访问，也可以指定具体的源'
          })}
        >
          <Form.List name={['allowedHostNames']}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <div style={{ width: '90%' }} className="flex items-center mb-4" key={field.key}>
                    <InputOrFromEnvWithItem
                      className="flex-1"
                      formItemProps={{ ...field, noStyle: true }}
                      // @ts-ignore
                      // inputRender={props => <UrlInput {...props} />}
                    />
                    <MinusCircleOutlined className="ml-2" onClick={() => remove(field.name)} />
                  </div>
                ))}
                <Form.Item
                  style={{
                    marginTop: fields.length ? '16px' : ''
                  }}
                  wrapperCol={{ span: 12 }}
                >
                  <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                    {intl.formatMessage({ defaultMessage: '增加允许HOST' })}
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label={intl.formatMessage({ defaultMessage: '重定向URL' })}>
          <Form.List name="authorizedRedirectUris">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <div style={{ width: '90%' }} className="flex items-center mb-4" key={field.key}>
                    <InputOrFromEnvWithItem
                      className="flex-1"
                      formItemProps={{ ...field, noStyle: true }}
                      // @ts-ignore
                      inputRender={props => <UrlInput {...props} />}
                    />
                    <MinusCircleOutlined className="ml-2" onClick={() => remove(field.name)} />
                  </div>
                ))}
                <Form.Item
                  style={{
                    marginTop: fields.length ? '16px' : ''
                  }}
                  wrapperCol={{ span: 12 }}
                >
                  <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                    {intl.formatMessage({ defaultMessage: '增加重定向URL' })}
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
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
