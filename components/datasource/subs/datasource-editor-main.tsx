import { RightSquareOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select, Switch, Radio } from 'antd'

import styles from './datasource-editor-main.module.scss'

export default function DatasourceEditorMain() {
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }

  return (
    <div className=" border-gray border">
      <div className=" border-gray border-b py-2 flex justify-end items-center pr-4 mb-6">
        <Button className={styles['connect-btn']}>
          <div>
            <RightSquareOutlined />
            <span className={styles['connect-text']}>测试链接</span>{' '}
          </div>
        </Button>
        <Switch
          defaultChecked
          checkedChildren="开启"
          unCheckedChildren="关闭"
          onChange={connectSwitchOnChange}
          className="ml-6 w-15 bg-green-500"
        />
      </div>

      <Form labelCol={{ span: 7 }} wrapperCol={{ span: 11 }} layout="horizontal" size="small">
        <Form.Item label="连接名">
          <Input />
        </Form.Item>
        <Form.Item label="类型">
          <Select>
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
          <Input />
        </Form.Item>
        <Form.Item label="连接URL">
          <Input />
        </Form.Item>
        <Form.Item label="主机">
          <Input />
        </Form.Item>
        <Form.Item label="数据库名">
          <Input />
        </Form.Item>
        <Form.Item label="端口">
          <Input />
        </Form.Item>
        <Form.Item label="用户">
          <Input />
        </Form.Item>
        <Form.Item label="密码">
          <Input />
        </Form.Item>
        <Form.Item className="flex justify-center">
          <div className="flex justify-center">
            <Button className={styles['cancel-btn']}>取消</Button>{' '}
            <Button className={styles['save-btn']}>保存</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
