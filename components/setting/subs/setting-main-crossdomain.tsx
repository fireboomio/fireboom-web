import { PlusOutlined, MinusCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button, Select, Switch } from 'antd'
import axios from 'axios'
import { useEffect } from 'react'

import styles from './setting-main.module.scss'

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

export default function SettingCrossdomain() {
  const onFinish = (values: unknown) => {
    console.log('Success:', values)
  }

  useEffect(() => {
    void axios.get('/api/v1/setting/corsConfiguration')
  }, [])

  return (
    <>
      <div className={`${styles['form-contain']}`}>
        <Form
          name="dynamic_form_item"
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
            name="corsName"
            label="允许域名"
            wrapperCol={{
              xs: { span: 20 },
              sm: { span: 20 },
            }}
          >
            <Form.List name="names" initialValue={[{}]}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item {...formItemLayoutWithOutLabel} required={false} key={field.key}>
                      <Form.Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                        <div>
                          <div>{'域名' + (index + 1).toString() + ':'}</div>
                          <Input placeholder="请输入域名..." style={{ width: '60%' }} />
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
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="allowHeader" label="允许头">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item name="exceptHeader" label="排除头">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item name="corsTime" label="跨域时间">
            <span>
              <Input /> 秒
            </span>
          </Form.Item>
          <Form.Item label="Username">
            <Form.Item
              valuePropName="checked"
              name="username"
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
    </>
  )
}
