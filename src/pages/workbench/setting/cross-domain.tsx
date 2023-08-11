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
      updateGlobalSetting(values)
      message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
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
        <Form.Item label={intl.formatMessage({ defaultMessage: '允许源' })}>
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
          label={intl.formatMessage({ defaultMessage: '排除头' })}
          name={['corsConfiguration', 'exposedHeaders']}
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
        >
          <InputNumber addonAfter="秒" />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '允许 Credentials' })}
          name={['corsConfiguration', 'allowCredentials']}
          valuePropName="checked"
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
