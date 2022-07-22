import { AppleOutlined } from '@ant-design/icons'
import { Divider, Form, Input, Switch } from 'antd'
import type { FC } from 'react'

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
      <Divider orientation="left" orientationMargin={0}>
        <div className="text-[#AFB0B4] text-14px space-x-1">
          <AppleOutlined />
          <span>授权</span>
        </div>
      </Divider>
      <Form.Item
        label="需要授权"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Switch />
        <span className="ml-26px text-[#00000040] text-12px inline-flex items-center ">
          <AppleOutlined />
          <span className="ml-1">开启后，登录后才能访问</span>
        </span>
      </Form.Item>
      <Divider orientation="left" orientationMargin={0} className="mt-42px">
        <div className="text-[#AFB0B4] text-14px space-x-1">
          <AppleOutlined />
          <span>缓存</span>
        </div>
      </Divider>
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
        <Input suffix="秒" />
      </Form.Item>
      <Form.Item
        label="重校验时长"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input suffix="秒" />
      </Form.Item>
      <Divider orientation="left" orientationMargin={0} className="mt-42px">
        <div className="text-[#AFB0B4] text-14px space-x-1">
          <AppleOutlined />
          <span>实时</span>
        </div>
      </Divider>
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
        <Input suffix="秒" />
      </Form.Item>
    </Form>
  )
}

export default Setting
