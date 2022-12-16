/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Switch } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import FormToolTip from '@/components/common/FormTooltip'
import IconFont from '@/components/Iconfont'
import { HttpRequestHeaders } from '@/lib/constant'
import requests from '@/lib/fetchers'

import tipCros from './assets/tip-cros.png'
import styles from './subs.module.less'

interface CorsConfiguration {
  allowedOrigins: Array<string>
  allowedMethods: Array<string>
  allowedHeaders: Array<string>
  allowCredentials: boolean
  allowedOriginsEnable: boolean
  exposedHeaders: Array<string>
  maxAge: number
}

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

export default function SettingCrossdomain() {
  const [corsConfig, setCorsConfig] = useImmer({} as CorsConfiguration)
  const [form] = Form.useForm()
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const urlReg = /^(http(s?)|):\/\/(.+)$/

  const postRequest = useCallback(
    async (key: string, value: string | Array<string> | boolean | number) => {
      await requests.post('/global', {
        key: key,
        val: value
      })
    },
    []
  )

  useEffect(() => {
    void requests.get<unknown, CorsConfiguration>('/setting/corsConfiguration').then(res => {
      setCorsConfig(res)
    })
  }, [refreshFlag])

  return (
    <>
      {corsConfig.allowedOrigins ? (
        <div className="pt-8 pl-8">
          <Form
            form={form}
            initialValues={{
              allowedMethods: corsConfig.allowedMethods,
              maxAge: corsConfig.maxAge,
              allowedHeaders: corsConfig.allowedHeaders,
              exposedHeaders: corsConfig.exposedHeaders,
              allowCredentials: corsConfig.allowCredentials
            }}
            labelAlign="left"
            labelCol={{
              xs: { span: 3 },
              sm: { span: 3 }
            }}
            wrapperCol={{
              xs: { span: 10 },
              sm: { span: 9 }
            }}
          >
            <Form.Item
              label={
                <div>
                  <span>允许源</span>
                  <FormToolTip
                    className="!left-4"
                    title={<img src={tipCros} className="max-w-60vw max-h-60vh" alt="" />}
                  />
                </div>
              }
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 }
              }}
            >
              <Switch
                className={styles['switch-edit-btn']}
                checked={corsConfig.allowedOriginsEnable}
                size="small"
                onChange={isChecked => {
                  void postRequest('allowedOriginsEnable', isChecked).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              />
              <span className="ml-4 text-default">允许全部</span>
            </Form.Item>
            {!corsConfig.allowedOriginsEnable && (
              <Form.Item
                wrapperCol={{
                  offset: 3,
                  xs: { span: 20 },
                  sm: { span: 20 }
                }}
              >
                <Form.List name="allowedOrigins" initialValue={corsConfig.allowedOrigins}>
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => {
                        const current =
                          form.getFieldValue(['allowedOrigins', field.name]) || 'https://'
                        const setFieldValue = (part: 'protocol' | 'path', value: string) => {
                          let [, protocol = 'https://', path = ''] =
                            current?.match(/(^https?:\/\/)(.*)/) || []
                          if (part === 'protocol') {
                            protocol = value
                          } else {
                            path = value
                          }
                          const url = `${protocol}${path}`
                          form.setFieldValue(['allowedOrigins', field.name], url)
                          if (part === 'protocol') {
                            doSave()
                          }
                        }
                        const doSave = () => {
                          const urlList = (
                            form.getFieldValue('allowedOrigins') as Array<string>
                          ).filter(url => url?.replace(/https?:\/\//, '').trim())
                          // 不用过滤后的数据进行覆盖，以防止用户输入过程中的数据被丢弃
                          // form.setFieldValue('allowedOrigins', urlList)
                          void postRequest(
                            'allowedOrigins',
                            form.getFieldValue('allowedOrigins') as Array<string>
                          ).then(() => {
                            setRefreshFlag(!refreshFlag)
                          })
                        }
                        return (
                          <Form.Item
                            {...formItemLayoutWithOutLabel}
                            required={false}
                            key={field.key}
                          >
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
                                  placeholder="对应请求响应中的: Access-Control-Allow-Origin"
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
                                      .post('/global', {
                                        key: 'allowedOrigins',
                                        val: (
                                          form.getFieldValue('allowedOrigins') as Array<string>
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
                          新增Origin
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            )}
            <Form.Item name="allowedMethods" label="允许方法" className="-mt-3">
              <Select
                style={{ width: '90%' }}
                mode="multiple"
                placeholder="请选择..."
                onChange={(values: string) => {
                  void postRequest('allowedMethods', values).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              >
                {['GET', 'POST'].map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="allowedHeaders" label="允许头">
              <Select
                mode="tags"
                options={HttpRequestHeaders.map(x => ({ label: x, value: x }))}
                onChange={(values: string) => {
                  void postRequest('allowedHeaders', values).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              />
            </Form.Item>
            <Form.Item name="exposedHeaders" label="排除头">
              <Select
                mode="tags"
                options={HttpRequestHeaders.map(x => ({ label: x, value: x }))}
                onChange={(values: string) => {
                  void postRequest('exposedHeaders', values).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              />
            </Form.Item>
            <Form.Item label="跨域时间">
              <Form.Item
                name="maxAge"
                validateTrigger={['onChange', 'onBlur']}
                noStyle
                rules={[
                  {
                    validator: (rule, value: number) => {
                      if (value) {
                        if (value < 0 || value > 86400) {
                          return Promise.reject('请填写范围内的跨域时间,范围为0- 86400 秒')
                        } else {
                          return Promise.resolve()
                        }
                      }
                    }
                  }
                ]}
              >
                <Input
                  addonAfter="秒"
                  onBlur={() => {
                    void postRequest('maxAge', Number(form.getFieldValue('maxAge') as string)).then(
                      () => {
                        setRefreshFlag(!refreshFlag)
                      }
                    )
                  }}
                  onPressEnter={() => {
                    void postRequest('maxAge', Number(form.getFieldValue('maxAge') as string)).then(
                      () => {
                        setRefreshFlag(!refreshFlag)
                      }
                    )
                  }}
                />
              </Form.Item>
            </Form.Item>
            <Form.Item label="允许证书">
              <Form.Item valuePropName="checked" name="allowCredentials" noStyle required>
                <Switch
                  size="small"
                  className={styles['switch-edit-btn']}
                  checked={corsConfig.allowCredentials}
                  onChange={isChecked => {
                    void postRequest('allowCredentials', isChecked).then(() => {
                      setRefreshFlag(!refreshFlag)
                    })
                  }}
                />
              </Form.Item>
              <span className="ml-4 text-gray-500 inline-block h-6">
                <IconFont type="icon-zhuyi" className="text-[14px]" /> 是否允许证书
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
