import { RightSquareOutlined, AppleOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Radio } from 'antd'

import styles from './datasource-editor-main.module.scss'

export default function DatasourceEditorMainEdit() {

  return (
    <>
      <div className="mb-4">
        <AppleOutlined />
        <span className="ml-2">default_db</span>
        <span className="ml-2 text-xs text-gray-500/80">main</span>
      </div>
      <div className=" border-gray border-b py-6 rounded-xl mb-4">
        <Form labelCol={{ span: 7 }} wrapperCol={{ span: 11 }} layout="horizontal" size="small">
          <Form.Item label="连接名">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="类型">
            <Select placeholder="请输入...">
              <Select.Option value="demo">Demo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="类型">
            <Radio.Group defaultValue="apple">
              <Radio value="apple"> 环境变量 </Radio>
              <Radio value="pear"> 连接URL </Radio>
              <Radio value="parma"> 连接参数 </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="环境变量">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="连接URL">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="主机">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="数据库名">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="端口">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="用户">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="密码">
            <Input placeholder="请输入..." />
          </Form.Item>
        </Form>
        <div className="flex justify-center">
          <Button className={styles['connect-btn']}>
            <RightSquareOutlined />
            <span className={styles['connect-text']}>测试链接</span>{' '}
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Button className={styles['cancel-btn']}>取消</Button>{' '}
        <Button className={styles['save-btn']}>保存</Button>
      </div>
    </>
  )
}
