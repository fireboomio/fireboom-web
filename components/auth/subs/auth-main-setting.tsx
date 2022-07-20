import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './auth-common-main.module.scss'

interface RedirectConfig {
  names: Array<string>
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

export default function AuthenticationMainSetting() {
  const [form] = Form.useForm()
  const [redirectConfig, setRedirectConfig] = useImmer({} as RedirectConfig)
  const onFinish = (values: RedirectConfig) => {
    console.log('Success:', values)
    void requests.post('/global', {
      key: 'enableGraphQLEndpoint',
      val: 0,
    })
  }

  const postRequest = async (key: string, value: string | Array<string> | number) => {
    await requests.post('/global', {
      key: key,
      val: value,
    })
    void getData()
  }

  const getData = useCallback(async () => {
    const result = await requests.get<unknown, RedirectConfig>('/auth/redirectUrl')
    console.log(result)
    setRedirectConfig(result)
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
      {redirectConfig.names?.length > 0 ? (
        <div className={`${styles['security-form-contain']}`}>
          <Form
            form={form}
            initialValues={{
              names: redirectConfig.names,
            }}
            layout="vertical"
            className="ml-50 -mt-5"
            name="dynamic_form_item"
            {...formItemLayoutWithOutLabel}
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
              <Form.List name="names">
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                        <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                          <div className="">
                            <div>{'域名' + (index + 1).toString() + ':'}</div>
                            <Input
                              placeholder="请输入域名"
                              style={{ width: '60%' }}
                              defaultValue={redirectConfig.names[index]}
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
                              <MinusCircleOutlined
                                className={`${styles['form-delete-icon']}`}
                                onClick={() => {
                                  void requests
                                    .post('/global', {
                                      key: 'names',
                                      val: (form.getFieldValue('names') as Array<string>).filter(
                                        (_, i) => i != index
                                      ),
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
        <>
          <span>loading</span>
        </>
      )}
    </>
  )
}
