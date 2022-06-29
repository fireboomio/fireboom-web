import { CaretDownOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import { Button, Form, Input, Select, Radio, Switch } from 'antd'

import styles from './datasource-rest-main.module.scss'

export default function DatasourceEditorMainEdit() {
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
  }

  return (
    <>
      <div className="border-gray border-b pb-5">
        <span className="ml-2">
          userinfo <span className="text-xs text-gray-500/80">GET</span>
        </span>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 11 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
        >
          <Form.Item label="命名空间:" colon={false} style={{ marginBottom: '10px' }}>
            <div className="flex items-center">
              <QuestionCircleOutlined className={styles['form-icon']} />
              <Input className="ml-3" placeholder="请输入..." />
            </div>
          </Form.Item>

          <Form.Item label="Rest 端点:" colon={false} required style={{ marginBottom: '10px' }}>
            <div className="flex items-center">
              <QuestionCircleOutlined className={styles['form-icon']} />
              <Input className="ml-3" placeholder="请输入..." />
            </div>
          </Form.Item>
          <Form.Item label="指定OAS:" colon={false} required style={{ marginBottom: '10px' }}>
            <div className="flex items-center">
              <QuestionCircleOutlined className={styles['form-icon']} />
              <Select className="ml-3" placeholder="请选择..." allowClear>
                1
              </Select>
            </div>
          </Form.Item>
          <div className="ml-40 mt-10 mb-4">
            <Button>请求头</Button>
            <Button type="primary" danger icon={<QuestionCircleOutlined />}>
              授权
            </Button>
          </div>

          <Form.Item label="JWT获取">
            <Radio.Group onChange={onChange}>
              <Radio value={1}>静态</Radio>
              <Radio value={2}>动态</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="密钥" required>
            <Input.Group compact>
              <Form.Item noStyle rules={[{ required: true }]}>
                <Select style={{ width: '20%' }} placeholder="值">
                  1
                </Select>
              </Form.Item>
              <Form.Item noStyle rules={[{ required: true }]}>
                <Input style={{ width: '80%' }} placeholder="请输入..." />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="签名方法">
            <Radio value={1} checked>
              HS256
            </Radio>
          </Form.Item>
          <Form.Item label="Token端点:" colon={false} required style={{ marginBottom: '39px' }}>
            <div className="flex items-center" style={{ marginBottom: '11px' }}>
              <QuestionCircleOutlined className={styles['form-icon']} />
              <Input className="ml-3" placeholder="请输入获取token的端点" />
            </div>
          </Form.Item>

          <div className={`${styles['more-info']} ml-40`}>
            <CaretDownOutlined className={styles['more-icon']} />
            <span className="mb-2.5 mt-4">更多</span>
          </div>
          <Form.Item
            label="是否状态联合:"
            style={{ marginBottom: '10px' }}
            rules={[{ required: true }]}
          >
            <div className="flex items-center">
              <QuestionCircleOutlined className={styles['form-icon']} />
              <Switch defaultChecked className={styles['switch-btn2']} size="small" />
            </div>
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 9, span: 16 }}
            style={{ display: 'flex', width: '100%', position: 'absolute', bottom: '20px' }}
          >
            <Button className={styles['cancel-btn']}>取消</Button>{' '}
            <Button type="primary" danger className={styles['save-btn']} htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
