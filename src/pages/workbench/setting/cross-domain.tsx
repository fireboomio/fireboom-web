import { MinusCircleOutlined } from '@ant-design/icons'
import { Button, Form, InputNumber, message, Select, Switch } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import InputOrFromEnvWithItem from '@/components/InputOrFromEnv'
import { HttpRequestHeaders } from '@/lib/constant'
import { useConfigContext } from '@/lib/context/ConfigContext'

export default function SettingMainVersion() {
  const intl = useIntl()
  const [form] = Form.useForm()

  const { globalSetting, updateGlobalSetting } = useConfigContext()
  if (!globalSetting) {
    return
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
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '允许源' })}
          tooltip={intl.formatMessage({
            defaultMessage:
              '指定允许访问的源（域名、协议、端口），使用通配符 * 表示允许所有源进行访问，也可以指定具体的源'
          })}
        >
          <Form.List name={['corsConfiguration', 'allowedOrigins']}>
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
                    {intl.formatMessage({ defaultMessage: '增加允许源' })}
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '允许方法' })}
          name={['corsConfiguration', 'allowedMethods']}
          tooltip={intl.formatMessage({
            defaultMessage:
              '指定允许的HTTP请求方法，多个方法使用逗号分隔。常见的方法包括GET、POST、PUT、DELETE等'
          })}
        >
          <Select
            className="disable-common-select"
            style={{ width: '90%' }}
            mode="multiple"
            placeholder={intl.formatMessage({ defaultMessage: '请选择' })}
          >
            {['GET', 'POST'].map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '允许头' })}
          name={['corsConfiguration', 'allowedHeaders']}
          tooltip={intl.formatMessage({
            defaultMessage:
              '指定允许的自定义请求头，多个头部字段使用逗号分隔。默认为 * ，表示不限制'
          })}
        >
          <Select
            className="disable-common-select"
            mode="tags"
            style={{ width: '90%' }}
            placeholder={intl.formatMessage({ defaultMessage: '请选择' })}
            options={HttpRequestHeaders.map(x => ({ label: x, value: x }))}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '暴露头' })}
          name={['corsConfiguration', 'exposedHeaders']}
          tooltip={intl.formatMessage({ defaultMessage: '指定响应中允许客户端访问的响应头' })}
        >
          <Select
            className="disable-common-select"
            mode="tags"
            style={{ width: '90%' }}
            placeholder={intl.formatMessage({ defaultMessage: '请选择' })}
            options={HttpRequestHeaders.map(x => ({ label: x, value: x }))}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '跨域时间' })}
          name={['corsConfiguration', 'maxAge']}
          tooltip={intl.formatMessage({
            defaultMessage:
              '指定预检请求（OPTIONS请求）的有效期，单位为秒，默认 120 秒 。在有效期内，浏览器无需再发送预检请求'
          })}
        >
          <InputNumber addonAfter="秒" />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '允许 Credentials' })}
          name={['corsConfiguration', 'allowCredentials']}
          valuePropName="checked"
          tooltip={intl.formatMessage({
            defaultMessage:
              '指定是否允许发送Cookie等凭证信息。如果设置为true，则表示允许发送凭证信息；如果设置为false，则不允许发送凭证信息'
          })}
        >
          <Switch />
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
