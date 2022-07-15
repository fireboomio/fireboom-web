import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button, Select, Switch } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

interface CorsConfiguration {
  allowedOrigins: Array<string>
  allowedMethods: Array<string>
  allowedHeaders: Array<string>
  allowCredentials: number
  exposedHeaders: Array<string>
  maxAge: number
}
//允许证书传0,1

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
// let corsConfiguration: CorsConfiguration = {
//   allowedOrigins: [],
//   allowedMethods: [],
//   allowedHeaders: [],
//   allowCredentials: 0,
//   exposedHeaders: [],
//   maxAge: 0,
// }

export default function SettingCrossdomain() {
  const [corsConfig, setCorsConfig] = useImmer({} as CorsConfiguration)
  const [form] = Form.useForm()
  const onFinish = async (values: CorsConfiguration) => {
    console.log('Success:', values)
    const result = await requests.post('/global', {
      key: 'allowedOrigins',
      val: values.allowedOrigins,
    })
    console.log(result)
  }

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, CorsConfiguration>('/setting/corsConfiguration')
    console.log(result)
    setCorsConfig(result)
  }, [])

  useEffect(() => {
    void getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <button
        onClick={() => {
          form.submit()
        }}
      >
        提交
      </button>
      {corsConfig.allowedOrigins ? (
        <div className={`${styles['form-contain']}`}>
          <Form
            form={form}
            initialValues={{
              methods: 'method1',
              corsTime: corsConfig.maxAge,
              allowHeader: corsConfig.allowedHeaders.join(','),
              exceptHeader: corsConfig.exposedHeaders.join(','),
              allowCredentials: corsConfig.allowCredentials,
            }}
            name="dynamic_form_item"
            onFinish={(values) => {
              void onFinish(values as CorsConfiguration)
            }}
            labelAlign="left"
            labelCol={{
              xs: { span: 3 },
              sm: { span: 3 },
            }}
            wrapperCol={{
              xs: { span: 10 },
              sm: { span: 9 },
            }}
          >
            <Form.Item
              label="允许域名"
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 },
              }}
            >
              <Form.List name="allowedOrigins" initialValue={corsConfig.allowedOrigins}>
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                        <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                          <div>
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名..."
                              style={{ width: '60%' }}
                              value={corsConfig.allowedOrigins[index]}
                            />
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className={`${styles['form-delete-icon']}`}
                                onClick={() => remove(field.name)}
                              />
                            ) : null}
                          </div>
                        </Form.Item>
                      </Form.Item>
                    ))}
                    <Form.Item wrapperCol={{ span: 20 }}>
                      <Button
                        type="dashed"
                        style={{ width: '48%' }}
                        onClick={() => {
                          add()
                        }}
                        icon={<PlusOutlined />}
                        className="text-gray-500/60"
                      >
                        新增域名
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Form.Item name="methods" label="允许方法" className="-mt-3">
              <Select style={{ width: '90%' }} placeholder="请选择...">
                {corsConfig.allowedMethods.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="allowHeader" label="允许头">
              <Input placeholder="请输入..." />
            </Form.Item>
            <Form.Item name="exceptHeader" label="排除头">
              <Input placeholder="请输入..." />
            </Form.Item>
            <Form.Item label="跨域时间">
              <Form.Item name="corsTime" validateTrigger={['onChange', 'onBlur']} noStyle>
                <Input />
              </Form.Item>
              <span className="ml-2">秒</span>
            </Form.Item>
            <Form.Item label="允许证书">
              <Form.Item
                valuePropName="checked"
                name="allowCredentials"
                noStyle
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <Switch />
              </Form.Item>
              <span className="ml-4 text-gray-500 inline-block h-6">
                <InfoCircleOutlined /> 是否允许证书
              </span>
            </Form.Item>
          </Form>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
