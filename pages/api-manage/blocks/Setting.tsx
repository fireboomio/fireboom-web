import type { FC } from 'react'
import { Form, Input, Switch } from 'antd'

type SettingProps = {
  //
}

const Setting: FC<SettingProps> = () => {
  return (
    <Form
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      requiredMark={false}
      labelAlign="left"
    >
      <Form.Item
        label="需要授权"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="开启缓存"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="最大时长"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="重校验时长"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="开启实时"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label="轮询间隔"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  )
}

export default Setting
