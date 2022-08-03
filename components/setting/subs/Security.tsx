import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Form, Input, Switch, Button } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

// eslint-disable-next-line import/no-unassigned-import
import styles from './subs.module.scss'

interface SecurConfig {
  enableGraphQLEndpoint: number
  allowedHosts: Array<string>
}

interface RedirectConfig {
  redirectURLs: Array<string>
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

function AuthMainSetting() {
  const [redirectConfig, setRedirectConfig] = useImmer({} as Array<string>)
  const [form] = Form.useForm()
  const onFinish = (values: RedirectConfig) => {
    console.log('Success:', values)
    void requests.post('/auth/redirectUrl', {
      redirectURLs: ['host1', 'host1'],
    })
  }
  const getData = useCallback(async () => {
    const result = await requests.get<unknown, Array<string>>('/auth/redirectUrl')
    console.log(result, '123')
    setRedirectConfig(result)
  }, [])

  useEffect(() => {
    // void requests.post('/auth/redirectUrl', {
    //   redirectURLs: ['host1', 'host1'],
    // })
    void getData()
  }, [])

  return (
    <>
      {redirectConfig?.length > 0 ? (
        <div className={`${styles['form-contain']} `}>
          <Form
            form={form}
            initialValues={{ redirectURLs: redirectConfig }}
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
            <Form.Item
              label="配置重定向URL"
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 },
              }}
            >
              <Form.List name="redirectURLs">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                        <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                          <div>
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名"
                              style={{ width: '60%' }}
                              defaultValue={redirectConfig[index]}
                              onBlur={() => {
                                void requests.post('/auth/redirectUrl', {
                                  redirectURLs: form.getFieldValue('redirectURLs') as Array<string>,
                                })
                              }}
                              onPressEnter={() => {
                                void requests.post('/auth/redirectUrl', {
                                  redirectURLs: form.getFieldValue('redirectURLs') as Array<string>,
                                })
                              }}
                            />
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className={`${styles['form-delete-icon']}`}
                                onClick={() => {
                                  void requests
                                    .post('/auth/redirectUrl', {
                                      redirectURLs: (
                                        form.getFieldValue('redirectURLs') as Array<string>
                                      ).filter((_, i) => i != index),
                                    })
                                    .then(() => {
                                      remove(index)
                                    })
                                }}
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
                        icon={<PlusOutlined />}
                        className="text-gray-500/60"
                        onClick={() => {
                          add()
                        }}
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
        ''
      )}
    </>
  )
}

export default function SettingMainSecurity() {
  const [form] = Form.useForm()
  const [securConfig, setSecurConfig] = useImmer({} as SecurConfig)
  const onFinish = (values: SecurConfig) => {
    console.log('Success:', values)
    void requests.post('/global', {
      key: 'enableGraphQLEndpoint',
      val: 0,
    })
    // void requests.post('/global', { key: 'cors.allowedHosts', val: values.allowedHosts })
  }
  const postRequest = async (key: string, value: string | Array<string> | number) => {
    await requests.post('/global', {
      key: key,
      val: value,
    })
  }

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, SecurConfig>('/setting/securityConfig')
    setSecurConfig(result)
  }, [])

  useEffect(() => {
    void getData()
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
      {securConfig.allowedHosts?.length > 0 ? (
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
                  className={styles['switch-edit-btn']}
                  size="small"
                  onChange={(isChecked) => {
                    void postRequest('enableGraphQLEndpoint', isChecked == false ? 0 : 1)
                  }}
                />
              </Form.Item>
              <span className={styles.setTitle}>
                <IconFont type="icon-zhuyi" className="mr-1 text-[14px]" />
                <span>https://loacalhost:9999</span>
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
                              defaultValue={securConfig.allowedHosts[index]}
                              onBlur={(e) => {
                                if (e.target.value == '') return
                                void postRequest(
                                  'allowedHosts',
                                  form.getFieldValue('allowedHosts') as Array<string>
                                )
                              }}
                              onPressEnter={(e) => {
                                if (e.target.value == '') return
                                void postRequest(
                                  'allowedHosts',
                                  form.getFieldValue('allowedHosts') as Array<string>
                                )
                              }}
                            />
                            {fields.length > 1 ? (
                              <IconFont
                                type="icon-guanbi"
                                className={`${styles['form-delete-icon']}`}
                                onClick={() => {
                                  void requests
                                    .post('/global', {
                                      key: 'allowedHosts',
                                      val: (
                                        form.getFieldValue('allowedHosts') as Array<string>
                                      ).filter((_, i) => i != index),
                                    })
                                    .then(() => {
                                      remove(index)
                                    })
                                }}
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
      <AuthMainSetting />
    </>
  )
}
