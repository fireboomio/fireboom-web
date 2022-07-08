import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { Form, Input, Button } from 'antd'

import styles from './setting-common.module.scss'

const formItemLayout = {
  labelCol: {
    xs: { span: 3 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 16 },
  },
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

export default function AuthenticationMainSetting() {
  const onFinish = (values: unknown) => {
    console.log('Success:', values)
  }

  return (
    <>
      <span className={styles.setWord}>配置重定向URL ：</span>
      <div className={`${styles['form-contain']}`}>
        <Form
          layout="vertical"
          className="ml-50 -mt-5"
          name="dynamic_form_item"
          {...formItemLayoutWithOutLabel}
          onFinish={onFinish}
          labelAlign="left"
        >
          <Form.List name="names">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={'域名' + (index + 1).toString() + ':'}
                    required={false}
                    key={index}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入域名或删除这个域名框',
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="请输入域名" style={{ width: '60%' }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className={`${styles['form-delete-icon']}`}
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item wrapperCol={{ span: 20 }}>
                  <Button
                    type="dashed"
                    style={{ width: '48%' }}
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className="text-gray-500/60 mt-4"
                  >
                    新增域名
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </>
  )
}
