/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from '@ant-design/icons'
import { Form, Input, Button, Select, Switch, Divider } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './subs.module.scss'

interface CorsConfiguration {
  allowedOrigins: Array<string>
  allowedMethods: Array<string>
  allowedHeaders: Array<string>
  allowCredentials: boolean
  exposedHeaders: Array<string>
  maxAge: number
}
//允许证书传0,1
interface CorsFormConfiguration {
  allowedOrigins: Array<string>
  allowedMethods: Array<string>
  allowedHeaders: string
  allowCredentials: boolean
  exposedHeaders: string
  maxAge: number
}

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
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const urlReg = /^(http(s?)|):\/\/(.+)$/
  // 0- 86400

  const onFinish = (values: CorsFormConfiguration) => {
    console.log('Success:', values)
  }

  const postRequest = useCallback(
    async (key: string, value: string | Array<string> | boolean | number) => {
      await requests.post('/global', {
        key: key,
        val: value,
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
      <Divider className={styles['divider-line']} />
      {corsConfig.allowedOrigins ? (
        <div className={`${styles['form-contain']}`}>
          <Form
            form={form}
            initialValues={{
              allowedMethods: corsConfig.allowedMethods[0],
              maxAge: corsConfig.maxAge,
              allowedHeaders: corsConfig.allowedHeaders.join(','),
              exposedHeaders: corsConfig.exposedHeaders.join(','),
              allowCredentials: corsConfig.allowCredentials,
            }}
            onFinish={values => {
              void onFinish(values as CorsFormConfiguration)
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
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          noStyle
                          rules={[
                            {
                              pattern: urlReg,
                              message: '请填写规范域名',
                            },
                          ]}
                        >
                          <div>
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名..."
                              style={{ width: '60%' }}
                              defaultValue={corsConfig.allowedOrigins[index]}
                              onBlur={() => {
                                void postRequest(
                                  'allowedOrigins',
                                  form.getFieldValue('allowedOrigins') as Array<string>
                                ).then(() => {
                                  setRefreshFlag(!refreshFlag)
                                })
                              }}
                              onPressEnter={() => {
                                void postRequest(
                                  'allowedOrigins',
                                  form.getFieldValue('allowedOrigins') as Array<string>
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
                                    key: 'allowedOrigins',
                                    val: (
                                      form.getFieldValue('allowedOrigins') as Array<string>
                                    ).filter((_, i) => i != index),
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
            <Form.Item name="allowedMethods" label="允许方法" className="-mt-3">
              <Select
                style={{ width: '90%' }}
                mode="multiple"
                placeholder="请选择..."
                onChange={(values: string) => {
                  const newMethodsList = corsConfig.allowedMethods.filter(item => item != values)
                  newMethodsList.unshift(values)
                  void postRequest('allowedMethods', newMethodsList).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              >
                {['GET', 'POST', 'PUT', 'DELETE'].map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="allowedHeaders" label="允许头">
              <Input
                placeholder="请输入..."
                onBlur={() => {
                  void postRequest(
                    'allowedHeaders',
                    (form.getFieldValue('allowedHeaders') as string).split(',')
                  ).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
                onPressEnter={() => {
                  void postRequest(
                    'allowedHeaders',
                    (form.getFieldValue('allowedHeaders') as string).split(',')
                  ).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
              />
            </Form.Item>
            <Form.Item name="exposedHeaders" label="排除头">
              <Input
                placeholder="请输入..."
                onBlur={() => {
                  void postRequest(
                    'exposedHeaders',
                    (form.getFieldValue('exposedHeaders') as string).split(',')
                  ).then(() => {
                    setRefreshFlag(!refreshFlag)
                  })
                }}
                onPressEnter={() => {
                  void postRequest(
                    'exposedHeaders',
                    (form.getFieldValue('exposedHeaders') as string).split(',')
                  ).then(() => {
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
                    },
                  },
                ]}
              >
                <Input
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
              <span className="ml-2">秒</span>
            </Form.Item>
            <Form.Item label="允许证书">
              <Form.Item valuePropName="checked" name="allowCredentials" noStyle required>
                <Switch
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
