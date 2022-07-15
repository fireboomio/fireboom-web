import { PlusOutlined, InfoCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Form, Input, Switch, Button } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './setting-main.module.scss'

interface SecurConfig {
  enableGraphQLEndpoint: number
  allowedHosts: Array<string>
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

export default function SettingMainSecurity() {
  const [form] = Form.useForm()
  const [securConfig, setSecurConfig] = useImmer({} as SecurConfig)
  const onFinish = (values: SecurConfig) => {
    console.log('Success:', values.allowedHosts)
    void requests.post('/global', { key: 'cors.allowedHosts', val: values.allowedHosts })
  }

  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  const getData = useCallback(async () => {
    const result = await requests.get<unknown, SecurConfig>('/setting/securityConfig')
    console.log(result)
    setSecurConfig(result)
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
      {securConfig.allowedHosts?.length > 1 ? (
        <div className={`${styles['security-form-contain']}`}>
          <Form
            form={form}
            name="dynamic_form_item"
            initialValues={{
              allowedHosts: securConfig.allowedHosts,
              enableGraphQLEndpoint: securConfig.enableGraphQLEndpoint,
            }}
            onFinish={onFinish}
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
            <Form.Item label="GraphQL端点：">
              <Form.Item
                valuePropName="checked"
                name="enableGraphQLEndpoint"
                noStyle
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <Switch
                  defaultChecked={securConfig.enableGraphQLEndpoint == 1 ? true : false}
                  className={styles['switch-edit-btn']}
                  size="small"
                  onChange={connectSwitchOnChange}
                />
              </Form.Item>
              <span className={styles.setTitle}>
                <InfoCircleOutlined className="mr-1" />
                <span>https://loacalhost:999</span>
              </span>
            </Form.Item>
            <Form.Item
              label="允许域名"
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 },
              }}
            >
              <Form.List name="allowedHosts">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                        <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                          <div className="">
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名..."
                              style={{ width: '60%' }}
                              value={securConfig.allowedHosts[index]}
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
                    <Form.Item wrapperCol={{ span: 20 }} className="mt-4">
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
          </Form>
        </div>
      ) : (
        <>
          <span>loading</span>
        </>
      )}
    </>
  )
}
