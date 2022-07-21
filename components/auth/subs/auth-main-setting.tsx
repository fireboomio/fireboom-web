import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './auth-common-main.module.scss'

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

export default function AuthMainSetting() {
  const [redirectConfig, setRedirectConfig] = useImmer({} as Array<string>)
  const [form] = Form.useForm()

  const onFinish = (values: Array<string>) => {
    console.log('Success:', values)
  }

  const postRequest = useCallback(async (key: string, value: string | Array<string> | number) => {
    await requests.post('/global', {
      key: key,
      val: value,
    })
  }, [])

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, Array<string>>('/auth/redirectUrl')
    console.log(result, '123')
    setRedirectConfig(result)
  }, [setRedirectConfig])

  useEffect(() => {
    void getData()
  })

  return (
    <>
      {redirectConfig?.length > 0 ? (
        <div className={`${styles['form-contain']} `}>
          <Form
            form={form}
            initialValues={{ redirectConfig }}
            onFinish={(values) => {
              void onFinish(values as Array<string>)
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
              label="配置重定向URL"
              wrapperCol={{
                xs: { span: 20 },
                sm: { span: 20 },
              }}
            >
              <Form.List name="redirectConfig">
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
                                void postRequest(
                                  'redirectConfig',
                                  form.getFieldValue('redirectConfig') as Array<string>
                                )
                              }}
                              onPressEnter={() => {
                                void postRequest(
                                  'redirectConfig',
                                  form.getFieldValue('redirectConfig') as Array<string>
                                )
                              }}
                            />
                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className={`${styles['form-delete-icon']}`}
                                onClick={() => {
                                  void requests
                                    .post('/global', {
                                      key: 'redirectConfig',
                                      val: (
                                        form.getFieldValue('redirectConfig') as Array<string>
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
