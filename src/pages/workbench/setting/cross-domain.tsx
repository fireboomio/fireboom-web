import { MinusCircleOutlined } from '@ant-design/icons'
import { Button, Form, InputNumber, message, Select, Switch } from 'antd'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import UrlInput from '@/components/UrlInput'
import { HttpRequestHeaders } from '@/lib/constant'
import requests from '@/lib/fetchers'
import tipGraphql from '@/pages/workbench/setting/components/subs/assets/tip-graphql.png'

export default function SettingMainVersion() {
  const intl = useIntl()
  const [form] = Form.useForm()
  const allowedOriginsEnabled = Form.useWatch('allowedOriginsEnabled', form)
  const { data, mutate } = useSWRImmutable('/setting/corsConfiguration', requests.get)
  useEffect(() => {
    form.resetFields()
  }, [data])

  function onFinish(values: any) {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }), 0)
    Promise.all(
      Object.keys(values).map(key => {
        // @ts-ignore
        if (JSON.stringify(values[key]) !== JSON.stringify(data[key])) {
          return requests.post('/global', { key: key, val: values[key] })
        }
      })
    )
      .then(() => {
        mutate()
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
        initialValues={data}
      >
        <Form.Item
          tooltip={{
            title: <img src={tipGraphql} className="max-w-60vw max-h-60vh" alt="" />,
            rootClassName: 'max-w-80vw max-h-80vh'
          }}
          label={intl.formatMessage({ defaultMessage: '允许源' })}
        >
          <div className="flex items-center">
            <Form.Item noStyle name="allowedOriginsEnabled" valuePropName="checked">
              <Switch />
            </Form.Item>
            <span className="align-middle ml-2">允许全部</span>
          </div>
        </Form.Item>
        <Form.List name="allowedOrigins">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  hidden={allowedOriginsEnabled}
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
              <Form.Item wrapperCol={{ offset: 5, span: 12 }} hidden={allowedOriginsEnabled}>
                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                  {intl.formatMessage({ defaultMessage: '增加允许源' })}
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item label={intl.formatMessage({ defaultMessage: '允许方法' })} name="allowedMethods">
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
        <Form.Item label={intl.formatMessage({ defaultMessage: '允许头' })} name="allowedHeaders">
          <Select
            className="disable-common-select"
            mode="tags"
            style={{ width: '90%' }}
            placeholder={intl.formatMessage({ defaultMessage: '请选择' })}
            options={HttpRequestHeaders.map(x => ({ label: x, value: x }))}
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ defaultMessage: '排除头' })} name="exposedHeaders">
          <Select
            className="disable-common-select"
            mode="tags"
            style={{ width: '90%' }}
            placeholder={intl.formatMessage({ defaultMessage: '请选择' })}
            options={HttpRequestHeaders.map(x => ({ label: x, value: x }))}
          />
        </Form.Item>
        <Form.Item label={intl.formatMessage({ defaultMessage: '跨域时间' })} name="maxAge">
          <InputNumber addonAfter="秒" />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '允许证书' })}
          name="allowCredentials"
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
