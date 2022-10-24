import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Switch } from 'antd'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'

interface SecurConfig {
  enableGraphQLEndpoint: boolean
  allowedHosts: Array<string>
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

function AuthMainSetting() {
  const [redirectURLs, setRedirectURLs] = useImmer<string[]>([])
  const [redirectURLsShow, setRedirectURLsShow] = useImmer(false)
  const [form] = Form.useForm()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const urlReg = /^(http(s?)|):\/\/(.+)$/
  useEffect(() => {
    void requests.get<unknown, string[]>('/auth/redirectUrl').then(res => {
      setRedirectURLs(res)
      setRedirectURLsShow(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  return (
    <>
      {redirectURLsShow ? (
        <div className={`${styles['form-contain']} `}>
          <Form
            form={form}
            initialValues={{ redirectURLs: redirectURLs }}
            labelAlign="left"
            labelCol={{
              xs: { span: 4 },
              sm: { span: 4 }
            }}
            wrapperCol={{
              xs: { span: 10 },
              sm: { span: 9 }
            }}
          >
            <Form.Item
              label="配置重定向URL"
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 }
              }}
            >
              <Form.List name="redirectURLs">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          noStyle
                          rules={[
                            {
                              pattern: urlReg,
                              message: '请填写规范域名'
                            }
                          ]}
                        >
                          <div>
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名"
                              style={{ width: '60%' }}
                              defaultValue={redirectURLs[index]}
                              onBlur={() => {
                                void requests
                                  .post('/auth/redirectUrl', {
                                    redirectURLs: form.getFieldValue(
                                      'redirectURLs'
                                    ) as Array<string>
                                  })
                                  .then(() => {
                                    setRefreshFlag(!refreshFlag)
                                  })
                              }}
                              onPressEnter={() => {
                                void requests
                                  .post('/auth/redirectUrl', {
                                    redirectURLs: form.getFieldValue(
                                      'redirectURLs'
                                    ) as Array<string>
                                  })
                                  .then(() => {
                                    setRefreshFlag(!refreshFlag)
                                  })
                              }}
                            />
                            <IconFont
                              type="icon-guanbi"
                              className={`${styles['form-delete-icon']}`}
                              onClick={() => {
                                void requests
                                  .post('/auth/redirectUrl', {
                                    redirectURLs: (
                                      form.getFieldValue('redirectURLs') as Array<string>
                                    ).filter((_, i) => i != index)
                                  })
                                  .then(() => {
                                    remove(index)
                                    setRefreshFlag(!refreshFlag)
                                  })
                              }}
                            />
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
                        onClick={() => add()}
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
      ) : null}
    </>
  )
}

export default function SettingMainSecurity() {
  const [form] = Form.useForm()
  const [securConfig, setSecurConfig] = useImmer({} as SecurConfig)
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const urlReg = /^(http(s?)|):\/\/(.+)$/

  const onFinish = (_values: SecurConfig) => {
    void requests
      .post('/global', {
        key: 'enableGraphQLEndpoint',
        val: 0
      })
      .then(() => {
        setRefreshFlag(!refreshFlag)
      })
    // void requests.post('/global', { key: 'cors.allowedHosts', val: values.allowedHosts })
  }
  const postRequest = async (key: string, value: string | Array<string> | number | boolean) => {
    await requests.post('/global', {
      key: key,
      val: value
    })
  }

  useEffect(() => {
    void requests.get<unknown, SecurConfig>('/setting/securityConfig').then(res => {
      setSecurConfig(res)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  return (
    <div className="pl-8 pt-4 bg-white h-full">
      {securConfig.allowedHosts ? (
        <div className={`${styles['security-form-contain']}`}>
          <Form
            form={form}
            name="dynamic_form_item"
            initialValues={{
              allowedHosts: securConfig?.allowedHosts,
              enableGraphQLEndpoint: securConfig.enableGraphQLEndpoint
            }}
            onFinish={onFinish}
            labelAlign="left"
            labelCol={{
              xs: { span: 4 },
              sm: { span: 4 }
            }}
            wrapperCol={{
              xs: { span: 10 },
              sm: { span: 9 }
            }}
          >
            <Form.Item label="GraphQL端点：">
              <Form.Item
                // valuePropName="checked"
                name="enableGraphQLEndpoint"
                noStyle
                required
              >
                <Switch
                  className={styles['switch-edit-btn']}
                  checked={securConfig.enableGraphQLEndpoint}
                  size="small"
                  onChange={isChecked => {
                    void postRequest('enableGraphQLEndpoint', isChecked).then(() => {
                      setRefreshFlag(!refreshFlag)
                    })
                  }}
                />
              </Form.Item>
              <span className={styles.setTitle}>
                <IconFont type="icon-zhuyi" className="mr-1 text-[14px]" />
                <span>https://loacalhost:9991/api/main/graphql</span>
              </span>
            </Form.Item>
            <Form.Item
              label="允许域名"
              wrapperCol={{
                xs: { span: 2 },
                sm: { span: 20 }
              }}
            >
              <Form.List name="allowedHosts">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          noStyle
                          rules={[
                            {
                              pattern: urlReg,
                              message: '请填写规范域名'
                            }
                          ]}
                        >
                          <div className="">
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名..."
                              style={{ width: '60%' }}
                              defaultValue={securConfig.allowedHosts[index]}
                              onBlur={e => {
                                if (e.target.value == '') return
                                void postRequest(
                                  'allowedHosts',
                                  form.getFieldValue('allowedHosts') as Array<string>
                                ).then(() => {
                                  setRefreshFlag(!refreshFlag)
                                })
                              }}
                              onPressEnter={e => {
                                // @ts-ignore
                                if (e.target.value == '') return
                                void postRequest(
                                  'allowedHosts',
                                  form.getFieldValue('allowedHosts') as Array<string>
                                ).then(() => {
                                  setRefreshFlag(!refreshFlag)
                                })
                              }}
                            />

                            <IconFont
                              type="icon-guanbi"
                              className={`${styles['form-delete-icon']}`}
                              onClick={() => {
                                void requests
                                  .post('/global', {
                                    key: 'allowedHosts',
                                    val: (
                                      form.getFieldValue('allowedHosts') as Array<string>
                                    ).filter((_, i) => i != index)
                                  })
                                  .then(() => {
                                    remove(index)
                                  })
                              }}
                            />
                          </div>
                        </Form.Item>
                      </Form.Item>
                    ))}
                    <Form.Item wrapperCol={{ span: 20 }} className="mt-4">
                      <Button
                        type="dashed"
                        style={{ width: '48%' }}
                        onClick={() => add()}
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
      ) : null}
      <AuthMainSetting />
    </div>
  )
}
