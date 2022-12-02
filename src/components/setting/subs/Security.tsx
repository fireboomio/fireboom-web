import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Switch } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import FormToolTip from '@/components/common/FormTooltip'
import IconFont from '@/components/iconfont'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'

import tipGraphql from './assets/tip-graphql.png'
import styles from './subs.module.less'

interface SecurConfig {
  allowedHostsEnable: boolean
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
              label="重定向URL"
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 }
              }}
            >
              <Form.List name="redirectURLs">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => {
                      const current = form.getFieldValue(['redirectURLs', field.name]) || 'https://'
                      const setFieldValue = (part: 'protocol' | 'path', value: string) => {
                        let [, protocol = 'https://', path = ''] =
                          current?.match(/(^https?:\/\/)(.*)/) || []
                        if (part === 'protocol') {
                          protocol = value
                        } else {
                          path = value
                        }
                        const url = `${protocol}${path}`
                        form.setFieldValue(['redirectURLs', field.name], url)
                        if (part === 'protocol') {
                          doSave()
                        }
                      }
                      const doSave = () => {
                        const urlList = (
                          form.getFieldValue('redirectURLs') as Array<string>
                        ).filter(url => url?.replace(/https?:\/\//, '').trim())
                        // 不用过滤后的数据进行覆盖，以防止用户输入过程中的数据被丢弃
                        // form.setFieldValue('redirectURLs', urlList)
                        void requests
                          .post('/auth/redirectUrl', {
                            redirectURLs: urlList
                          })
                          .then(() => {
                            setRefreshFlag(!refreshFlag)
                          })
                      }
                      return (
                        <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                          <Form.Item validateTrigger={['onChange', 'onBlur']} noStyle>
                            <div>
                              <div>{'域名' + (index + 1).toString() + ':'}</div>
                              <Input
                                addonBefore={
                                  <Select
                                    defaultValue={current.match(/^https?:\/\//)?.[0]}
                                    className="select-before"
                                    onChange={e => setFieldValue('protocol', e)}
                                  >
                                    <Select.Option value="https://">https://</Select.Option>
                                    <Select.Option value="http://">http://</Select.Option>
                                  </Select>
                                }
                                placeholder="请输入域名"
                                style={{ width: '60%' }}
                                onChange={e => setFieldValue('path', e.target.value)}
                                defaultValue={current.replace(/^https?:\/\//, '')}
                                onBlur={doSave}
                                onPressEnter={doSave}
                              />

                              <span
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
                              >
                                <img src="/assets/deleteIcon.svg" alt=" " />
                              </span>
                            </div>
                          </Form.Item>
                        </Form.Item>
                      )
                    })}
                    <Form.Item wrapperCol={{ span: 20 }} className="mt-4">
                      <Button
                        type="dashed"
                        style={{ width: '48%' }}
                        icon={<PlusOutlined />}
                        className="text-gray-500/60"
                        onClick={() => add()}
                      >
                        新增URL
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
  const { config: globalConfig } = useContext(ConfigContext)

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
                  disabled={globalConfig.devSwitch}
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
                <span>https://localhost:9991/api/main/graphql</span>
              </span>
            </Form.Item>

            <Form.Item
              label={
                <div>
                  <span>允许主机</span>
                  <FormToolTip
                    className="!left-4"
                    title={<img src={tipGraphql} className="max-w-60vw max-h-60vh" alt="" />}
                  />
                </div>
              }
              wrapperCol={{
                xs: { span: 2 },
                sm: { span: 20 }
              }}
            >
              <Switch
                className={styles['switch-edit-btn']}
                checked={securConfig.allowedHostsEnable}
                size="small"
                onChange={isChecked => {
                  void postRequest('allowedHostsEnable', isChecked).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              />
              <span className="ml-4 text-default">允许全部</span>
            </Form.Item>
            {!securConfig.allowedHostsEnable && (
              <Form.Item
                wrapperCol={{
                  offset: 4,
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
                            rules={[]}
                          >
                            <div className="">
                              <div>{'域名' + (index + 1).toString() + ':'}</div>
                              <Input
                                addonBefore="http(s)://"
                                placeholder="localhost:9991"
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
                              <span
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
                              >
                                <img src="/assets/deleteIcon.svg" alt=" " />
                              </span>
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
                          新增HOST
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            )}
          </Form>
        </div>
      ) : null}
      <AuthMainSetting />
    </div>
  )
}
